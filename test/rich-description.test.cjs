const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

function loadTs(source) {
  const compiled = ts.transpileModule(fs.readFileSync(source, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  const loaded = new Module(source, module);
  loaded.filename = source;
  loaded.paths = Module._nodeModulePaths(path.dirname(source));
  loaded._compile(compiled.outputText, source);
  return loaded.exports;
}

const lib = loadTs(path.join(__dirname, '../src/lib/richDescription.ts'));

test('plain descriptions are unchanged paragraphs', () => {
  const blocks = lib.parseDescription('Hello world\nsecond line\n\nNew para');
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0].t, 'p');
  assert.equal(blocks[0].lines.length, 2);
  assert.equal(lib.descriptionToPlainText('Hello world\nsecond line\n\nNew para'),
    'Hello world\nsecond line\n\nNew para');
});

test('bold, italic and links parse, nested', () => {
  const [p] = lib.parseDescription('a **bold *and italic*** [site](https://zynvo.com)');
  const kinds = p.lines[0].map((n) => n.t);
  assert.deepEqual(kinds, ['text', 'bold', 'text', 'link']);
  assert.equal(p.lines[0][1].c[1].t, 'italic');
  assert.equal(p.lines[0][3].href, 'https://zynvo.com');
});

test('unsafe link schemes are rendered as plain text, never links', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,x', 'JaVaScRiPt:alert(1)', '//evil.com']) {
    const [p] = lib.parseDescription(`[click](${url})`);
    assert.deepEqual(p.lines[0], [{ t: 'text', v: 'click' }], url);
  }
  assert.equal(lib.insertLink('x', 0, 1, 'javascript:alert(1)'), null);
});

test('raw HTML is just text (the renderer never emits markup)', () => {
  const [p] = lib.parseDescription('<script>alert(1)</script><b>hi</b>');
  assert.equal(p.lines[0].length, 1);
  assert.equal(p.lines[0][0].t, 'text');
});

test('alignment, headings, lists and spacers', () => {
  const blocks = lib.parseDescription(
    '::center ## Title\n\n::right Right text\n\n- one\n- two\n\n::space\n\nend'
  );
  assert.deepEqual(blocks.map((b) => b.t), ['h', 'p', 'ul', 'space', 'p']);
  assert.equal(blocks[0].align, 'center');
  assert.equal(blocks[1].align, 'right');
  assert.equal(blocks[2].items.length, 2);
});

test('plain text strips all markup', () => {
  const text = lib.descriptionToPlainText(
    '::center ## Hi\n\n**bold** and [link](https://a.com)\n\n- a\n- b'
  );
  assert.equal(text, 'Hi\n\nbold and link\n\n• a\n• b');
});

test('toggleWrap wraps and unwraps the selection', () => {
  const wrapped = lib.toggleWrap('make this bold', 5, 9, '**');
  assert.equal(wrapped.value, 'make **this** bold');
  const undone = lib.toggleWrap(wrapped.value, wrapped.selectionStart, wrapped.selectionEnd, '**');
  assert.equal(undone.value, 'make this bold');
  assert.equal(lib.toggleWrap('', 0, 0, '*').value, '*text*');
});

test('setAlignment targets only the cursor paragraph and can be cleared', () => {
  const v = 'first\n\nsecond\n\nthird';
  const centered = lib.setAlignment(v, 8, 8, 'center');
  assert.equal(centered.value, 'first\n\n::center second\n\nthird');
  const right = lib.setAlignment(centered.value, centered.selectionStart, centered.selectionEnd, 'right');
  assert.equal(right.value, 'first\n\n::right second\n\nthird');
  const left = lib.setAlignment(right.value, right.selectionStart, right.selectionEnd, 'left');
  assert.equal(left.value, v);
});

test('toggleLinePrefix adds and removes list/heading prefixes', () => {
  const on = lib.toggleLinePrefix('a\nb\nc', 0, 3, '- ');
  assert.equal(on.value, '- a\n- b\nc');
  const off = lib.toggleLinePrefix(on.value, 0, 7, '- ');
  assert.equal(off.value, 'a\nb\nc');
});

test('insertSpacer adds a ::space paragraph after the current one', () => {
  const r = lib.insertSpacer('one\n\ntwo', 1);
  assert.equal(r.value, 'one\n\n::space\n\ntwo');
  assert.equal(lib.insertSpacer('only', 4).value, 'only\n\n::space');
});

test('underline and strikethrough parse and nest with bold', () => {
  const [p] = lib.parseDescription('__under__ ~~gone~~ **b __both__**');
  const kinds = p.lines[0].map((n) => n.t);
  assert.deepEqual(kinds, ['underline', 'text', 'strike', 'text', 'bold']);
  assert.equal(p.lines[0][4].c[1].t, 'underline');
});

test('colour and size spans parse from a fixed palette only', () => {
  const [p] = lib.parseDescription('[hot]{red} [big]{xl} [both]{blue lg}');
  const spans = p.lines[0].filter((n) => n.t === 'span');
  assert.deepEqual(spans.map((s) => [s.color, s.size]), [
    ['red', undefined],
    [undefined, 'xl'],
    ['blue', 'lg'],
  ]);
});

test('unknown or hostile span attributes are ignored and the text is kept', () => {
  // Letters-only words that aren't in the palette: span dropped, text kept.
  for (const attrs of ['javascript', 'url', 'notacolour']) {
    const [p] = lib.parseDescription(`[text]{${attrs}}`);
    assert.deepEqual(p.lines[0], [{ t: 'text', v: 'text' }], attrs);
  }
  // Anything with other characters (CSS-like) is not a span at all: shown
  // literally, never styled.
  for (const raw of ['[text]{color:red}', '[text]{red;x}', '[text]{red"onload=1}']) {
    const [p] = lib.parseDescription(raw);
    assert.ok(p.lines[0].every((n) => n.t === 'text'), raw);
  }
  // A real word mixed with junk keeps only the allowed one.
  const [q] = lib.parseDescription('[x]{red javascript}');
  assert.equal(q.lines[0][0].color, 'red');
});

test('spans can hold bold, and links are not mistaken for spans', () => {
  const [p] = lib.parseDescription('[**loud**]{red} [site](https://a.com)');
  assert.equal(p.lines[0][0].t, 'span');
  assert.equal(p.lines[0][0].c[0].t, 'bold');
  assert.equal(p.lines[0][2].t, 'link');
});

test('plain text drops underline, strike and span markers', () => {
  assert.equal(
    lib.descriptionToPlainText('__a__ ~~b~~ [c]{red lg} d'),
    'a b c d'
  );
});

test('applySpan wraps, updates, merges and clears', () => {
  const made = lib.applySpan('say hi now', 4, 6, 'color', 'red');
  assert.equal(made.value, 'say [hi]{red} now');
  // selection stays on "hi", so a second change updates the same span
  const sized = lib.applySpan(made.value, made.selectionStart, made.selectionEnd, 'size', 'lg');
  assert.equal(sized.value, 'say [hi]{red lg} now');
  const recoloured = lib.applySpan(sized.value, sized.selectionStart, sized.selectionEnd, 'color', 'blue');
  assert.equal(recoloured.value, 'say [hi]{blue lg} now');
  const noColor = lib.applySpan(recoloured.value, recoloured.selectionStart, recoloured.selectionEnd, 'color', null);
  assert.equal(noColor.value, 'say [hi]{lg} now');
  const cleared = lib.applySpan(noColor.value, noColor.selectionStart, noColor.selectionEnd, 'size', null);
  assert.equal(cleared.value, 'say hi now');
  // clearing with nothing to clear is a no-op
  assert.equal(lib.applySpan('plain', 0, 5, 'color', null).value, 'plain');
});

test('toggleWrap works for underline and strikethrough markers', () => {
  const u = lib.toggleWrap('make this', 5, 9, '__');
  assert.equal(u.value, 'make __this__');
  assert.equal(lib.toggleWrap(u.value, u.selectionStart, u.selectionEnd, '__').value, 'make this');
  assert.equal(lib.toggleWrap('x', 0, 1, '~~').value, '~~x~~');
});

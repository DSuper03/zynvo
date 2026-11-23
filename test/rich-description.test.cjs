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

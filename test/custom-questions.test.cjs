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

const lib = loadTs(path.join(__dirname, '../src/lib/customQuestions.ts'));
const q = (label, extra = {}) => ({ label, type: 'text', required: false, options: [], ...extra });

test('options parse from comma text, trimming and dropping blanks', () => {
  assert.deepEqual(lib.parseOptions('S, M ,, L ,'), ['S', 'M', 'L']);
  assert.deepEqual(lib.parseOptions(''), []);
});

test('normalize trims labels, drops blanks, keeps options only for dropdowns, sets order', () => {
  const out = lib.normalizeQuestions([
    q('  Name  '),
    q('   '),
    q('Size', { type: 'select', options: [' S ', '', 'M'] }),
    q('Site', { type: 'url', options: ['ignored'] }),
  ]);
  assert.deepEqual(out, [
    { label: 'Name', type: 'text', options: [], required: false, sortOrder: 0 },
    { label: 'Size', type: 'select', options: ['S', 'M'], required: false, sortOrder: 1 },
    { label: 'Site', type: 'url', options: [], required: false, sortOrder: 2 },
  ]);
  assert.deepEqual(lib.normalizeQuestions(undefined), []);
  assert.equal(lib.normalizeQuestions([q('x', { type: 'weird' })])[0].type, 'text');
});

test('changed detection ignores ids, whitespace and client-only fields', () => {
  const saved = [{ id: 'abc', ...q('Name'), sortOrder: 0 }, { id: 'def', ...q('Size', { type: 'select', options: ['S', 'M'] }), sortOrder: 1 }];
  const same = [{ id: 'x1', ...q(' Name '), sortOrder: 9 }, { id: 'x2', ...q('Size', { type: 'select', options: ['S', ' M'] }) }];
  assert.equal(lib.questionsChanged(same, saved), false);
  assert.equal(lib.questionsChanged(undefined, []), false);
});

test('changed detection catches edits, required, add, remove and reorder', () => {
  const saved = [q('A'), q('B')];
  assert.equal(lib.questionsChanged([q('A'), q('C')], saved), true);
  assert.equal(lib.questionsChanged([q('A'), q('B', { required: true })], saved), true);
  assert.equal(lib.questionsChanged([...saved, q('C')], saved), true);
  assert.equal(lib.questionsChanged([q('A')], saved), true);
  assert.equal(lib.questionsChanged([q('B'), q('A')], saved), true);
  assert.equal(lib.questionsChanged([], saved), true, 'removing all is a change');
});

test('validate flags blank labels, option-less dropdowns and too many', () => {
  assert.equal(lib.validateQuestions([q('ok')]), null);
  assert.equal(lib.validateQuestions([]), null);
  assert.match(lib.validateQuestions([q('ok'), q('  ')]), /Question 2 needs a label/);
  assert.match(lib.validateQuestions([q('Size', { type: 'select', options: [] })]), /add at least one option/);
  assert.equal(lib.validateQuestions([q('Size', { type: 'select', options: ['S'] })]), null);
  const many = Array.from({ length: 11 }, (_, i) => q(`Q${i}`));
  assert.match(lib.validateQuestions(many), /at most 10/);
});

test('moveQuestion swaps neighbours and is a no-op at the edges', () => {
  assert.deepEqual(lib.moveQuestion(['a', 'b', 'c'], 1, -1), ['b', 'a', 'c']);
  assert.deepEqual(lib.moveQuestion(['a', 'b', 'c'], 1, 1), ['a', 'c', 'b']);
  const list = ['a', 'b'];
  assert.equal(lib.moveQuestion(list, 0, -1), list);
  assert.equal(lib.moveQuestion(list, 1, 1), list);
});

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

const lib = loadTs(path.join(__dirname, '../src/lib/eventTags.ts'));

test('normalizeTag lowercases, tidies and keeps useful symbols', () => {
  assert.equal(lib.normalizeTag('  Machine   Learning '), 'machine learning');
  assert.equal(lib.normalizeTag('C++'), 'c++');
  assert.equal(lib.normalizeTag('AI/ML'), 'ai/ml');
  assert.equal(lib.normalizeTag('R&D'), 'r&d');
  assert.equal(lib.normalizeTag('--hack.'), 'hack');
});

test('normalizeTag keeps non-English words intact, including vowel signs', () => {
  assert.equal(lib.normalizeTag('हिंदी'), 'हिंदी');
  assert.equal(lib.normalizeTag('বাংলা'), 'বাংলা');
});

test('normalizeTag strips markup characters', () => {
  // angle brackets are gone; a leftover '/' is harmless text (tags are never rendered as HTML)
  assert.equal(lib.normalizeTag('<b>hi</b>'), 'bhi/b');
  assert.equal(lib.normalizeTag('"x"; (y)'), 'x y');
});

test('addTags adds one tag, skipping blanks and duplicates', () => {
  assert.deepEqual(lib.addTags([], ' Hackathon ').tags, ['hackathon']);
  assert.deepEqual(lib.addTags(['hackathon'], 'HACKATHON').tags, ['hackathon']);
  assert.deepEqual(lib.addTags(['a'], '   ').tags, ['a']);
  assert.equal(lib.addTags([], 'ok').error, undefined);
});

test('addTags accepts several comma separated tags at once (paste)', () => {
  const r = lib.addTags(['a'], 'b, C ,,a, d');
  assert.deepEqual(r.tags, ['a', 'b', 'c', 'd']);
  assert.equal(r.error, undefined);
});

test('addTags stops at 5 tags and says why, keeping what fit', () => {
  const r = lib.addTags(['a', 'b', 'c'], 'd, e, f, g');
  assert.deepEqual(r.tags, ['a', 'b', 'c', 'd', 'e']);
  assert.equal(r.error, 'You can add up to 5 tags.');
  const full = lib.addTags(['a', 'b', 'c', 'd', 'e'], 'f');
  assert.deepEqual(full.tags, ['a', 'b', 'c', 'd', 'e']);
  assert.ok(full.error);
});

test('addTags rejects over-long tags but keeps the valid ones', () => {
  const r = lib.addTags([], `ok, ${'x'.repeat(25)}`);
  assert.deepEqual(r.tags, ['ok']);
  assert.equal(r.error, 'Tags can be up to 24 characters.');
  assert.deepEqual(lib.addTags([], 'x'.repeat(24)).tags, ['x'.repeat(24)]);
});

test('addTags does not change the list it was given', () => {
  const current = ['a'];
  lib.addTags(current, 'b');
  assert.deepEqual(current, ['a']);
});

test('readTags tolerates events with no tags or odd data', () => {
  assert.deepEqual(lib.readTags(undefined), []);
  assert.deepEqual(lib.readTags(null), []);
  assert.deepEqual(lib.readTags('hackathon'), []);
  assert.deepEqual(lib.readTags(['Hackathon', 5, '', 'AI']), ['hackathon', 'ai']);
  assert.equal(lib.readTags(['a', 'b', 'c', 'd', 'e', 'f', 'g']).length, 5);
});

test('tagHref encodes the tag', () => {
  assert.equal(lib.tagHref('hackathon'), '/events?tag=hackathon');
  assert.equal(lib.tagHref('c++'), '/events?tag=c%2B%2B');
  assert.equal(lib.tagHref('ai/ml'), '/events?tag=ai%2Fml');
});

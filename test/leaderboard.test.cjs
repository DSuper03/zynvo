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
  loaded.require = function (id) {
    const candidate = id.startsWith('.')
      ? path.resolve(path.dirname(source), id + '.ts')
      : '';
    return candidate && fs.existsSync(candidate)
      ? loadTs(candidate)
      : Module.prototype.require.call(this, id);
  };
  loaded._compile(compiled.outputText, source);
  return loaded.exports;
}
const loaded = {
  exports: loadTs(path.resolve(__dirname, '../src/lib/leaderboard.ts')),
};
const {
  readLeaderboardFilters,
  leaderboardParams,
  fetchLeaderboard,
  LeaderboardRequestError,
  retryAfterTime,
  rankingsSchema,
} = loaded.exports;
const filters = readLeaderboardFilters(new URLSearchParams());
const valid = () => ({
  entries: [
    {
      id: 'a',
      name: 'Club',
      college: 'Campus',
      clubName: 'Club',
      image: null,
      registrations: 3,
      uniqueStudents: 2,
      eventsCount: 1,
      rank: 1,
    },
  ],
  colleges: ['Campus'],
  totals: {
    registrations: 3,
    uniqueStudents: 2,
    eventsCount: 1,
    rankedCount: 1,
  },
  ...filters,
  maxPage: 1000,
  pageSize: 25,
  timezone: 'Asia/Kolkata',
  start: '2026-11-15T18:30:00.000Z',
  end: '2026-11-22T12:00:00.000Z',
  generatedAt: '2026-11-22T12:00:00.000Z',
});

test('URL filters sanitize hostile values and bound pagination', () => {
  assert.deepEqual(
    readLeaderboardFilters(
      new URLSearchParams(
        'kind=users&period=year&page=-1&college=%00Campus&search=%0Ahello'
      )
    ),
    { ...filters, college: 'Campus', search: 'hello' }
  );
  assert.equal(
    readLeaderboardFilters(new URLSearchParams('page=9999')).page,
    1000
  );
  const chosen = {
    ...filters,
    kind: 'events',
    period: 'month',
    college: 'A & B',
    search: '100%',
    page: 2,
  };
  assert.deepEqual(readLeaderboardFilters(leaderboardParams(chosen)), chosen);
});
test('schema rejects broken payloads, duplicate rows, unsafe counts and invalid dates', () => {
  assert.equal(rankingsSchema.safeParse(valid()).success, true);
  assert.equal(rankingsSchema.safeParse({}).success, false);
  for (const mutate of [
    (d) => d.entries.push(d.entries[0]),
    (d) => (d.entries[0].registrations = -1),
    (d) => (d.entries[0].uniqueStudents = 100),
    (d) => (d.generatedAt = 'yesterday'),
  ]) {
    const data = valid();
    mutate(data);
    assert.equal(rankingsSchema.safeParse(data).success, false);
  }
});
test('successful requests are validated against the requested filters', async (t) => {
  t.mock.method(global, 'fetch', async () => Response.json(valid()));
  assert.equal((await fetchLeaderboard(filters)).entries[0].registrations, 3);
  await assert.rejects(
    fetchLeaderboard({ ...filters, kind: 'events' }),
    (e) => e instanceof LeaderboardRequestError && e.status === 502
  );
});
test('malformed 200 JSON is handled as a request failure', async (t) => {
  t.mock.method(global, 'fetch', async () => Response.json({}));
  await assert.rejects(fetchLeaderboard(filters), (e) => e.status === 502);
});
test('429 honors bounded Retry-After and exposes no server response text', async (t) => {
  t.mock.method(
    global,
    'fetch',
    async () =>
      new Response('internal secret', {
        status: 429,
        headers: { 'retry-after': '5' },
      })
  );
  const now = Date.now();
  await assert.rejects(
    fetchLeaderboard(filters),
    (e) =>
      e.status === 429 &&
      e.retryAt >= now + 5000 &&
      !e.message.includes('secret')
  );
  assert.equal(retryAfterTime('999999', 0), 300000);
  assert.equal(retryAfterTime('bad', 0), 60000);
  assert.equal(retryAfterTime('Thu, 01 Jan 1970 00:00:05 GMT', 0), 5000);
});
test('network failures provide a safe, actionable message', async (t) => {
  t.mock.method(global, 'fetch', async () => {
    throw new Error('private backend address');
  });
  await assert.rejects(
    fetchLeaderboard(filters),
    (e) =>
      e.status === 0 &&
      /connection/.test(e.message) &&
      !e.message.includes('private')
  );
});
test('timeouts abort the request and return a timeout message', async (t) => {
  t.mock.method(global, 'setTimeout', (callback) => {
    queueMicrotask(callback);
    return 0;
  });
  t.mock.method(
    global,
    'fetch',
    (_url, { signal }) =>
      new Promise((_resolve, reject) =>
        signal.addEventListener('abort', () =>
          reject(new DOMException('Aborted', 'AbortError'))
        )
      )
  );
  await assert.rejects(fetchLeaderboard(filters), (e) =>
    /too long/.test(e.message)
  );
});
test('superseded requests preserve cancellation rather than showing an error', async (t) => {
  const controller = new AbortController();
  t.mock.method(global, 'fetch', async (_url, { signal }) => {
    controller.abort();
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
  });
  await assert.rejects(
    fetchLeaderboard(filters, controller.signal),
    (e) => e.name === 'AbortError'
  );
});

test('proxy rate-limit errors preserve Retry-After and never cache failures', async () => {
  const { tooManyRequests, normalizeUpstreamError } = loadTs(
    path.resolve(__dirname, '../src/lib/server/errors.ts')
  );
  assert.equal(tooManyRequests('request-id').headers.get('retry-after'), '60');
  const response = await normalizeUpstreamError(
    Response.json(
      { message: 'Please slow down' },
      { status: 429, headers: { 'retry-after': '12' } }
    ),
    'request-id'
  );
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '12');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const failure = await normalizeUpstreamError(
    new Response('private error', { status: 500 }),
    'request-id'
  );
  assert.equal(failure.headers.get('cache-control'), 'no-store');
  assert.equal((await failure.text()).includes('private error'), false);
});

test('HTML returned with a successful status is rejected safely', async (t) => {
  t.mock.method(global, 'fetch', async (_url, options) => {
    assert.equal(options.cache, 'no-store');
    return new Response('<html>not rankings</html>', {
      headers: { 'content-type': 'text/html' },
    });
  });
  await assert.rejects(
    fetchLeaderboard(filters),
    (error) => error.status === 502
  );
});

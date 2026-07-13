const endpoints = [
  {
    method: 'GET',
    path: '/api/health',
    description: 'Returns the health status for the public API surface.',
  },
  {
    method: 'GET',
    path: '/api/discover/posts',
    description: 'Returns discover feed posts for the campus social experience.',
  },
  {
    method: 'GET',
    path: '/api/public/top-clubs',
    description: 'Returns highlighted clubs for discovery surfaces.',
  },
  {
    method: 'POST',
    path: '/api/seo/generate',
    description: 'Generates SEO metadata for event and content pages.',
  },
  {
    method: 'GET',
    path: '/api/seo/bulk',
    description: 'Returns cached SEO records when available.',
  },
  {
    method: 'GET',
    path: '/api/imagekit-signature',
    description: 'Creates upload signatures for client-side ImageKit uploads.',
  },
  {
    method: 'POST',
    path: '/api/upload/image',
    description: 'Uploads images used by the platform.',
  },
  {
    method: 'POST',
    path: '/api/telemetry/client-error',
    description: 'Accepts client-side error telemetry events.',
  },
];

export default function ApiDocsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Zynvo API Catalog</h1>
      <p className="mt-4 text-base text-muted-foreground">
        This page documents the public API resources exposed by the Zynvo web application.
        The machine-readable API description is available at{' '}
        <a className="underline underline-offset-4" href="/openapi.json">
          /openapi.json
        </a>
        , and the operational health endpoint is available at{' '}
        <a className="underline underline-offset-4" href="/api/health">
          /api/health
        </a>
        .
      </p>

      <section className="mt-10 space-y-4">
        {endpoints.map((endpoint) => (
          <article key={`${endpoint.method}-${endpoint.path}`} className="rounded-lg border p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded bg-black px-2 py-1 text-xs font-semibold text-white">
                {endpoint.method}
              </span>
              <code className="text-sm">{endpoint.path}</code>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{endpoint.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

# Zynvo API Discovery

Use this skill when an agent needs to understand or call Zynvo's public web APIs.

## Discover the API surface

1. Fetch `https://zynvosocial.com/.well-known/api-catalog` for the machine-readable API catalog.
2. Fetch `https://zynvosocial.com/openapi.json` for the OpenAPI description.
3. Read `https://zynvosocial.com/api-docs` for human-readable endpoint summaries.

## Core endpoints

- `GET /api/health` for service availability checks.
- `GET /api/discover/posts` for discover feed content.
- `GET /api/public/top-clubs` for highlighted clubs.
- `POST /api/seo/generate` for SEO metadata generation.
- `GET /api/seo/bulk` for cached SEO records.
- `GET /api/imagekit-signature` for upload signatures.
- `POST /api/upload/image` for image uploads.
- `POST /api/telemetry/client-error` for client error telemetry.

## Guidance

- Prefer the API catalog and OpenAPI document before guessing request shapes.
- Check `GET /api/health` before attempting larger workflows.
- Use OAuth bearer authentication when an endpoint requires authorization.

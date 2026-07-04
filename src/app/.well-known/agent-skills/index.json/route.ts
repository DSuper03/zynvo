import { createHash } from 'crypto';
import { readFile } from 'fs/promises';
import path from 'path';

import { NextResponse } from 'next/server';

const SITE_URL = 'https://zynvosocial.com';
const SCHEMA_URL = 'https://schemas.agentskills.io/discovery/0.2.0/schema.json';

const skillDefinitions = [
  {
    name: 'zynvo-api',
    description: 'Discover and use Zynvo public API metadata, docs, and core endpoints.',
    publicPath: '/.well-known/agent-skills/zynvo-api/SKILL.md',
  },
  {
    name: 'zynvo-auth',
    description: 'Discover Zynvo OAuth, OIDC, protected-resource, and auth.md metadata.',
    publicPath: '/.well-known/agent-skills/zynvo-auth/SKILL.md',
  },
];

export const runtime = 'nodejs';

function toAbsolutePublicPath(publicPath: string) {
  return path.join(process.cwd(), 'public', ...publicPath.replace(/^\//, '').split('/'));
}

async function computeDigest(publicPath: string) {
  const bytes = await readFile(toAbsolutePublicPath(publicPath));
  const digest = createHash('sha256').update(bytes).digest('hex');
  return `sha256:${digest}`;
}

export async function GET() {
  const skills = await Promise.all(
    skillDefinitions.map(async (skill) => ({
      name: skill.name,
      type: 'skill-md' as const,
      description: skill.description,
      url: `${SITE_URL}${skill.publicPath}`,
      digest: await computeDigest(skill.publicPath),
    })),
  );

  return NextResponse.json(
    {
      $schema: SCHEMA_URL,
      skills,
    },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    },
  );
}

'use client';

import { useEffect } from 'react';

type JsonSchema = {
  type: 'object';
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
};

type ToolResult = {
  content: Array<{ type: 'text'; text: string }>;
};

type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: JsonSchema;
  annotations?: {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
  };
  execute: (input: Record<string, unknown>) => Promise<ToolResult>;
};

type WebMcpRegistry = {
  registerTool: (tool: WebMcpTool, options?: { signal?: AbortSignal }) => Promise<unknown>;
};

function getModelContext(): WebMcpRegistry | null {
  if (typeof document !== 'undefined') {
    const docWithModelContext = document as Document & { modelContext?: WebMcpRegistry };
    if (docWithModelContext.modelContext?.registerTool) {
      return docWithModelContext.modelContext;
    }
  }

  if (typeof navigator !== 'undefined') {
    const navWithModelContext = navigator as Navigator & { modelContext?: WebMcpRegistry };
    if (navWithModelContext.modelContext?.registerTool) {
      return navWithModelContext.modelContext;
    }
  }

  return null;
}

function textResult(value: unknown): ToolResult {
  return {
    content: [
      {
        type: 'text',
        text: typeof value === 'string' ? value : JSON.stringify(value, null, 2),
      },
    ],
  };
}

async function fetchJson(path: string) {
  const response = await fetch(path, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${path} (${response.status})`);
  }

  return response.json();
}

export default function WebMcpBootstrap() {
  useEffect(() => {
    const modelContext = getModelContext();
    if (!modelContext) return;

    const controller = new AbortController();

    const registerTools = async () => {
      const tools: WebMcpTool[] = [
        {
          name: 'open_zynvo_page',
          description:
            'Navigate the current tab to a key Zynvo page such as discover, events, clubs, api docs, or auth guidance.',
          inputSchema: {
            type: 'object',
            properties: {
              page: {
                type: 'string',
                enum: ['home', 'discover', 'events', 'clubs', 'news', 'api-docs', 'auth'],
              },
            },
            required: ['page'],
            additionalProperties: false,
          },
          execute: async ({ page }) => {
            const pageMap: Record<string, string> = {
              home: '/',
              discover: '/discover',
              events: '/events',
              clubs: '/clubs',
              news: '/news',
              'api-docs': '/api-docs',
              auth: '/auth.md',
            };

            const destination = pageMap[String(page)];
            if (!destination) {
              return textResult('Unknown page. Supported values: home, discover, events, clubs, news, api-docs, auth.');
            }

            window.location.assign(destination);
            return textResult(`Navigating to ${destination}`);
          },
        },
        {
          name: 'get_zynvo_api_metadata',
          description:
            'Return machine-readable discovery URLs for the Zynvo public APIs, including the API catalog, OpenAPI document, health endpoint, and skills index.',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
          annotations: {
            readOnlyHint: true,
          },
          execute: async () =>
            textResult({
              apiCatalog: `${window.location.origin}/.well-known/api-catalog`,
              openApi: `${window.location.origin}/openapi.json`,
              health: `${window.location.origin}/api/health`,
              apiDocs: `${window.location.origin}/api-docs`,
              agentSkills: `${window.location.origin}/.well-known/agent-skills/index.json`,
            }),
        },
        {
          name: 'get_zynvo_auth_metadata',
          description:
            'Return the OAuth, OpenID Connect, protected-resource, and auth.md discovery URLs used by Zynvo.',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
          annotations: {
            readOnlyHint: true,
          },
          execute: async () =>
            textResult({
              protectedResource: `${window.location.origin}/.well-known/oauth-protected-resource`,
              authorizationServer: `${window.location.origin}/.well-known/oauth-authorization-server`,
              openIdConfiguration: `${window.location.origin}/.well-known/openid-configuration`,
              authMd: `${window.location.origin}/auth.md`,
            }),
        },
        {
          name: 'get_zynvo_top_clubs',
          description:
            'Fetch the current top clubs payload from the public Zynvo API for discovery and ranking use cases.',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
          annotations: {
            readOnlyHint: true,
          },
          execute: async () => textResult(await fetchJson('/api/public/top-clubs')),
        },
      ];

      for (const tool of tools) {
        await modelContext.registerTool(tool, { signal: controller.signal });
      }
    };

    void registerTools().catch(() => {
      // Ignore registration failures in unsupported or changing preview implementations.
    });

    return () => {
      controller.abort();
    };
  }, []);

  return null;
}

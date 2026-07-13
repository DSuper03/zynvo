const SITE_URL = 'https://zynvosocial.com';
const MCP_ENDPOINT = `${SITE_URL}/mcp`;

export function getMcpServerCard() {
  return {
    $schema: 'https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json',
    version: '1.0',
    protocolVersion: '2025-06-18',
    serverInfo: {
      name: 'zynvo',
      title: 'Zynvo MCP Server',
      version: '0.1.0',
    },
    description:
      'Draft MCP discovery metadata for Zynvo. This endpoint advertises the planned remote MCP transport for campus discovery and event intelligence workflows.',
    documentationUrl: `${SITE_URL}/api-docs`,
    transport: {
      type: 'streamable-http',
      endpoint: MCP_ENDPOINT,
    },
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
    authentication: {
      required: true,
      schemes: ['bearer', 'oauth2'],
    },
    instructions:
      'Use OAuth bearer tokens for protected requests. Fetch the well-known OAuth discovery metadata before attempting authenticated MCP calls.',
  };
}

export function getMcpResponseHeaders(methods = 'GET, OPTIONS') {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    'Cache-Control': 'public, max-age=3600, s-maxage=3600',
  };
}

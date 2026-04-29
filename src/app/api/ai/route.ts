import { NextResponse } from 'next/server';

export const runtime = 'edge';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = process.env.OPENROUTER_GEMINI_MODEL || 'google/gemini-2.5-flash';

const STREAM_PROGRESS_UPDATES = [
  'Receiving live intelligence updates.',
  'Scanning extracted text for dates, venues, and registration actions.',
  'Validating links before creating event cards.',
  'Keeping the interface live while sources are being ranked.',
];

type StreamEvent =
  | { type: 'status'; text: string }
  | { type: 'thought'; text: string }
  | { type: 'event'; event: StudentEvent }
  | { type: 'summary'; text: string; sources?: SourceLink[] }
  | { type: 'error'; error: string }
  | { type: 'done' };

type StudentEvent = {
  title: string;
  type: 'fest' | 'hackathon' | 'workshop' | 'other';
  date: string;
  venue: string;
  registrationUrl?: string;
  sourceUrl?: string;
  organizer?: string;
  confidence?: 'verified' | 'likely' | 'needs_check';
  actionLabel?: string;
  whyRelevant?: string;
};

type SourceLink = {
  title?: string;
  url: string;
};

const encoder = new TextEncoder();

function encodeEvent(event: StreamEvent) {
  return encoder.encode(`${JSON.stringify(event)}\n`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function sanitizeText(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function sanitizeUrl(value: unknown) {
  const candidate = sanitizeText(value);
  if (!candidate) return undefined;

  try {
    const url = new URL(candidate);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function sanitizeEvent(value: unknown): StudentEvent | null {
  if (!isRecord(value)) return null;

  const title = sanitizeText(value.title);
  if (!title) return null;

  const eventType = sanitizeText(value.type).toLowerCase();
  const confidence = sanitizeText(value.confidence).toLowerCase();

  return {
    title,
    type: ['fest', 'hackathon', 'workshop'].includes(eventType)
      ? (eventType as StudentEvent['type'])
      : 'other',
    date: sanitizeText(value.date, 'Date to verify'),
    venue: sanitizeText(value.venue, 'Venue to verify'),
    registrationUrl: sanitizeUrl(value.registrationUrl),
    sourceUrl: sanitizeUrl(value.sourceUrl),
    organizer: sanitizeText(value.organizer) || undefined,
    confidence: ['verified', 'likely', 'needs_check'].includes(confidence)
      ? (confidence as StudentEvent['confidence'])
      : 'needs_check',
    actionLabel: sanitizeText(value.actionLabel) || 'Register',
    whyRelevant: sanitizeText(value.whyRelevant) || undefined,
  };
}

function sanitizeSources(value: unknown): SourceLink[] {
  if (!Array.isArray(value)) return [];

  return value
    .map<SourceLink | null>((item) => {
      if (!isRecord(item)) return null;
      const url = sanitizeUrl(item.url);
      if (!url) return null;

      return {
        title: sanitizeText(item.title) || undefined,
        url,
      };
    })
    .filter((item): item is SourceLink => Boolean(item))
    .slice(0, 10);
}

function stripCodeFence(value: string) {
  return value
    .trim()
    .replace(/^```(?:json|jsonl)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function normalizeAgentLine(line: string): StreamEvent | null {
  const normalized = stripCodeFence(line);
  if (!normalized.trim()) return null;

  try {
    const parsed = JSON.parse(normalized) as unknown;
    if (!isRecord(parsed)) return null;

    const type = sanitizeText(parsed.type);

    if (type === 'status' || type === 'thought') {
      const text = sanitizeText(parsed.text);
      return text ? { type, text } : null;
    }

    if (type === 'event') {
      const event = sanitizeEvent(parsed.event);
      return event ? { type: 'event', event } : null;
    }

    if (type === 'summary') {
      const text = sanitizeText(parsed.text, 'Extraction complete.');
      return {
        type: 'summary',
        text,
        sources: sanitizeSources(parsed.sources),
      };
    }
  } catch {
    return null;
  }

  return null;
}

function normalizeAgentBlock(content: string): StreamEvent[] {
  const normalized = stripCodeFence(content);
  if (!normalized) return [];

  const lineEvents = normalized
    .split('\n')
    .map((line) => normalizeAgentLine(line))
    .filter((event): event is StreamEvent => Boolean(event));

  if (lineEvents.length > 0) return lineEvents;

  try {
    const parsed = JSON.parse(normalized) as unknown;
    if (!isRecord(parsed)) return [];

    const events: StreamEvent[] = [];
    const thoughts = Array.isArray(parsed.thoughts)
      ? parsed.thoughts
      : Array.isArray(parsed.thoughtStream)
        ? parsed.thoughtStream
        : [];

    thoughts.forEach((thought) => {
      const text =
        typeof thought === 'string'
          ? thought.trim()
          : isRecord(thought)
            ? sanitizeText(thought.text)
            : '';
      if (text) events.push({ type: 'thought', text });
    });

    const studentEvents = Array.isArray(parsed.events)
      ? parsed.events
      : Array.isArray(parsed.items)
        ? parsed.items
        : [];

    studentEvents.forEach((item) => {
      const event = sanitizeEvent(item);
      if (event) events.push({ type: 'event', event });
    });

    const summary =
      typeof parsed.summary === 'string'
        ? parsed.summary
        : isRecord(parsed.summary)
          ? sanitizeText(parsed.summary.text)
          : sanitizeText(parsed.text);

    if (summary) {
      events.push({
        type: 'summary',
        text: summary,
        sources: sanitizeSources(
          isRecord(parsed.summary) ? parsed.summary.sources : parsed.sources
        ),
      });
    }

    return events;
  } catch {
    return [];
  }
}

function buildSystemPrompt() {
  return `You are Zynvo Event Intelligence, a specialist agent that bridges raw web data and student-centric event discovery.

Mission:
- Use live web search and semantic parsing to identify upcoming campus or student-community fests, hackathons, and workshops.
- Prefer India and student-relevant events unless the user explicitly asks otherwise.
- Extract only immediate action details: title, event type, date, venue, official/verified registration URL, source URL, organizer, confidence, and a short relevance note.
- Filter marketing noise, sponsor boilerplate, generic campus copy, stale events, and vague announcements without an actionable date or source.
- A registration URL is verified only when it appears to be official, from the host, college, organizer, Unstop/Devfolio/Dare2Compete/Eventbrite/official event page, or a clearly linked registration form.
- If a date, venue, or registration link is uncertain, say so with confidence "needs_check" and do not invent details.

Output contract:
- Return JSON Lines only. No markdown, no prose outside JSON.
- Each line must be a complete JSON object.
- Do not wrap the response in a markdown code fence.
- Stream progressively: output a newline immediately after each thought or event object, then continue searching. Do not wait to collect every event before writing.
- Never return a single JSON object with arrays and never return a JSON array.
- Start with 2-4 concise {"type":"thought","text":"..."} lines describing observable extraction steps. These are audit updates, not hidden chain-of-thought.
- Emit one {"type":"event","event":{...}} line per event.
- End with one {"type":"summary","text":"...","sources":[{"title":"...","url":"..."}]} line.
- Event shape: {"title":string,"type":"fest"|"hackathon"|"workshop"|"other","date":string,"venue":string,"registrationUrl"?:string,"sourceUrl"?:string,"organizer"?:string,"confidence":"verified"|"likely"|"needs_check","actionLabel":string,"whyRelevant"?:string}
- Keep values short and UI-card friendly.`;
}

export async function POST(req: Request) {
  try {
    const { prompt } = (await req.json()) as { prompt?: string };
    const q = sanitizeText(prompt);

    if (!q) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const apiKey = sanitizeText(process.env.OPENROUTER_API_KEY);
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI event intelligence is not configured on the server.' },
        { status: 500 }
      );
    }

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (event: StreamEvent) => controller.enqueue(encodeEvent(event));

        send({ type: 'status', text: 'Activating campus web intelligence agent.' });
        send({ type: 'status', text: 'Searching for student-ready event sources.' });

        try {
          const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://zynvo.app',
              'X-Title': 'Zynvo Event Intelligence',
            },
            body: JSON.stringify({
              model: MODEL,
              stream: true,
              temperature: 0.2,
              max_tokens: 2200,
              tools: [
                { type: 'openrouter:web_search', parameters: { max_results: 8 } },
                { type: 'openrouter:datetime' },
              ],
              messages: [
                { role: 'system', content: buildSystemPrompt() },
                {
                  role: 'user',
                  content: `Find upcoming student fests, hackathons, and workshops from campus/community web data for this request:\n\n${q}`,
                },
              ],
            }),
          });

          if (!response.ok || !response.body) {
            await response.text().catch(() => '');
            send({
              type: 'error',
              error: `AI event intelligence request failed with status ${response.status}.`,
            });
            send({ type: 'done' });
            controller.close();
            return;
          }

          send({ type: 'status', text: 'Parsing pages and filtering marketing noise.' });

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let sseBuffer = '';
          let contentBuffer = '';
          let rawContent = '';
          let emittedEvents = 0;
          let emittedStructuredMessages = 0;
          let progressIndex = 0;
          let streamedContentChars = 0;
          let nextProgressAt = 180;

          const flushAgentLines = () => {
            let newlineIndex = contentBuffer.indexOf('\n');
            while (newlineIndex !== -1) {
              const line = contentBuffer.slice(0, newlineIndex).trim();
              contentBuffer = contentBuffer.slice(newlineIndex + 1);
              const event = normalizeAgentLine(line);
              if (event) {
                emittedStructuredMessages += 1;
                if (event.type === 'event') emittedEvents += 1;
                send(event);
              }
              newlineIndex = contentBuffer.indexOf('\n');
            }
          };

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            sseBuffer += decoder.decode(value, { stream: true });
            let lineEnd = sseBuffer.indexOf('\n');

            while (lineEnd !== -1) {
              const line = sseBuffer.slice(0, lineEnd).trim();
              sseBuffer = sseBuffer.slice(lineEnd + 1);

              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') break;

                try {
                  const parsed = JSON.parse(data) as {
                    error?: { message?: string };
                    choices?: Array<{ delta?: { content?: string } }>;
                  };

                  if (parsed.error?.message) {
                    send({ type: 'error', error: parsed.error.message });
                    continue;
                  }

                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    rawContent += content;
                    contentBuffer += content;
                    streamedContentChars += content.length;

                    if (
                      emittedStructuredMessages === 0 &&
                      streamedContentChars >= nextProgressAt
                    ) {
                      send({
                        type: 'status',
                        text:
                          STREAM_PROGRESS_UPDATES[
                            progressIndex % STREAM_PROGRESS_UPDATES.length
                          ],
                      });
                      progressIndex += 1;
                      nextProgressAt += 220;
                    }

                    flushAgentLines();
                  }
                } catch {
                  // Upstream streams can include keepalive comments or provider-specific chunks.
                }
              }

              lineEnd = sseBuffer.indexOf('\n');
            }
          }

          const trailingEvents =
            emittedStructuredMessages === 0
              ? normalizeAgentBlock(rawContent)
              : normalizeAgentBlock(contentBuffer.trim());

          trailingEvents.forEach((event) => {
            emittedStructuredMessages += 1;
            if (event.type === 'event') emittedEvents += 1;
            send(event);
          });

          if (emittedEvents === 0 && emittedStructuredMessages > 0) {
            send({
              type: 'summary',
              text: 'The agent completed the scan but did not find any actionable upcoming event with enough date, venue, and registration evidence.',
            });
          }

          if (emittedStructuredMessages === 0) {
            send({
              type: 'summary',
              text:
                stripCodeFence(rawContent) ||
                'The agent finished, but the model did not return structured event lines. Try a narrower campus, city, or event type.',
            });
          }

          send({ type: 'done' });
          controller.close();
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Failed to stream AI response.';
          send({ type: 'error', error: message });
          send({ type: 'done' });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate response';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

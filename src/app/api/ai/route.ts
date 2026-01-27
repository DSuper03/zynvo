import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const MODEL = (process.env.GOOGLE_AI_MODEL || process.env.NEXT_PUBLIC_GOOGLE_AI_MODEL || 'gemini-2.5-flash') as string;

export async function POST(req: Request) {
  try {
    const { prompt } = (await req.json()) as { prompt?: string };
    const q = (prompt || '').trim();
    if (!q) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    // SECURITY: Only use server-side environment variable, never NEXT_PUBLIC_ prefix for API keys
    const apiKey = (process.env.GOOGLE_AI_API_KEY || '').trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GOOGLE_AI_API_KEY' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey } as any);

    // India-only policy and steering
    const INDIA_POLICY = `You are Zynvo's AI. STRICT SCOPE: Only use information about college events and college clubs within India. If the user asks about events/clubs outside India or globally, politely state that you only cover India and ask them to reframe their query for India. Prefer data and examples from Indian colleges and universities. When performing searches, bias toward Indian sources (e.g., .in domains, Indian institutions).`;

    // Ask for a structured JSON when possible for UI cards
    const STRUCTURE_INSTRUCTIONS = `If the user's query is about listing or recommending events or clubs, return a compact JSON object with an array 'items', each item shaped as: { "title": string, "subtitle"?: string, "description"?: string, "url"?: string, "badge"?: string, "image"?: string, "meta"?: string }. Keep strings short. Do not include markdown. If not applicable, return a normal answer.`;

    const steerToIndia = (text: string) => {
      const lowered = text.toLowerCase();
      const mentionsIndia =
        lowered.includes(' india') ||
        lowered.includes('indian') ||
        lowered.includes('in india') ||
        lowered.includes('india?') ||
        lowered.includes('india.');
      if (mentionsIndia) return text;
      return `${text} (in India)`;
    };

    const nonIndiaCountries = [
      'usa','united states','uk','united kingdom','canada','australia','germany','france','japan','china','singapore','uae','dubai','qatar','nepal','sri lanka','bangladesh','pakistan','spain','italy','brazil','mexico','russia','korea','south korea','new zealand','ireland','netherlands','sweden','switzerland','norway','denmark'
    ];
    const qLower = q.toLowerCase();
    const isExplicitlyNonIndia = nonIndiaCountries.some((c) => qLower.includes(c));
    const finalUserPrompt = isExplicitlyNonIndia
      ? `${q}\n\nIMPORTANT: Scope restricted to India only. Please reframe for India.`
      : steerToIndia(q);

    const groundingTool = { googleSearch: {} };
    const config = { tools: [groundingTool] };
    const contents = `${INDIA_POLICY}\n\n${STRUCTURE_INSTRUCTIONS}\n\nUser query: ${finalUserPrompt}`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config,
    });

    const text = (response as any)?.text ?? 'No response.';

    // Try to parse structured items if model returned JSON
    let items: any[] = [];
    try {
      // Extract first JSON block if present
      const str = String(text);
      const jsonFence = str.match(/```json[\s\S]*?```/i);
      const raw = jsonFence ? jsonFence[0].replace(/```json/i, '').replace(/```/, '').trim() : str;
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) {
        items = parsed.items.slice(0, 24); // safety cap
      }
    } catch (_) {
      // ignore parsing errors; plain text will be used
    }

    return NextResponse.json({ text: String(text), items }, { status: 200 });
  } catch (err: any) {
    const message = err?.message || 'Failed to generate response';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}



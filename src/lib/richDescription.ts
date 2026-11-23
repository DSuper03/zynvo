/**
 * Event descriptions are stored as plain text with a small Markdown-style
 * markup, so they stay readable anywhere that doesn't render them (the app,
 * emails, search results) and old plain descriptions keep working unchanged.
 *
 *   **bold**   *italic*   [link text](https://example.com)
 *   ## Heading
 *   - list item
 *   ::center / ::right / ::left   at the start of a paragraph = alignment
 *   ::space                       on its own line = extra vertical gap
 *   blank line = new paragraph; single newline = line break
 *
 * Nothing here produces HTML: the renderer builds React elements, so a
 * description can never inject markup or scripts.
 */

export type Align = 'left' | 'center' | 'right';

export type Inline =
  | { t: 'text'; v: string }
  | { t: 'bold'; c: Inline[] }
  | { t: 'italic'; c: Inline[] }
  | { t: 'link'; href: string; c: Inline[] };

export type Block =
  | { t: 'p'; align: Align; lines: Inline[][] }
  | { t: 'h'; align: Align; c: Inline[] }
  | { t: 'ul'; items: Inline[][] }
  | { t: 'space' };

// bold (closing ** must not be followed by another *, so "**a *b***" nests),
// italic, and links (the URL may contain one level of balanced parentheses).
const INLINE_RE =
  /\*\*([\s\S]+?)\*\*(?!\*)|\*([^*\n]+?)\*|\[([^\]\n]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/;
const ALIGN_RE = /^::(left|center|right)[ \t]+/;

/** Only web and mail links are allowed; anything else is shown as plain text. */
export function safeHref(raw: string): string | null {
  const href = raw.trim();
  return /^(https?:\/\/|mailto:)/i.test(href) ? href : null;
}

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let rest = text;
  while (rest) {
    const m = INLINE_RE.exec(rest);
    if (!m) {
      out.push({ t: 'text', v: rest });
      break;
    }
    if (m.index > 0) out.push({ t: 'text', v: rest.slice(0, m.index) });
    if (m[1] !== undefined) {
      out.push({ t: 'bold', c: parseInline(m[1]) });
    } else if (m[2] !== undefined) {
      out.push({ t: 'italic', c: parseInline(m[2]) });
    } else {
      const href = safeHref(m[4]);
      out.push(
        href
          ? { t: 'link', href, c: parseInline(m[3]) }
          : { t: 'text', v: m[3] }
      );
    }
    rest = rest.slice(m.index + m[0].length);
  }
  return out;
}

export function parseDescription(source: string): Block[] {
  const text = (source || '').replace(/\r\n?/g, '\n').trim();
  if (!text) return [];
  const blocks: Block[] = [];

  for (const chunk of text.split(/\n{2,}/)) {
    const lines = chunk.split('\n');
    let align: Align = 'left';
    const first = ALIGN_RE.exec(lines[0]);
    if (first) {
      align = first[1] as Align;
      lines[0] = lines[0].slice(first[0].length);
    }

    if (lines.length === 1 && lines[0].trim() === '::space') {
      blocks.push({ t: 'space' });
      continue;
    }
    if (lines.every((l) => /^[-•]\s+/.test(l))) {
      blocks.push({
        t: 'ul',
        items: lines.map((l) => parseInline(l.replace(/^[-•]\s+/, ''))),
      });
      continue;
    }
    if (/^##\s+/.test(lines[0])) {
      blocks.push({
        t: 'h',
        align,
        c: parseInline(lines[0].replace(/^##\s+/, '')),
      });
      lines.shift();
      if (lines.length === 0) continue;
    }
    blocks.push({ t: 'p', align, lines: lines.map(parseInline) });
  }
  return blocks;
}

function inlineToText(nodes: Inline[]): string {
  return nodes
    .map((n) => (n.t === 'text' ? n.v : inlineToText(n.c)))
    .join('');
}

/** The description without any markup, for search results, calendars and previews. */
export function descriptionToPlainText(source: string): string {
  return parseDescription(source)
    .map((b) => {
      if (b.t === 'space') return '';
      if (b.t === 'h') return inlineToText(b.c);
      if (b.t === 'ul') return b.items.map((i) => `• ${inlineToText(i)}`).join('\n');
      return b.lines.map(inlineToText).join('\n');
    })
    .join('\n\n')
    .trim();
}

// ---------------------------------------------------------------------------
// Editing helpers (pure, so they can be tested without a DOM)
// ---------------------------------------------------------------------------

export interface EditResult {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

/** Wrap the selection in a marker such as ** or *; unwrap if it is already wrapped. */
export function toggleWrap(
  value: string,
  start: number,
  end: number,
  marker: string,
  placeholder = 'text'
): EditResult {
  const m = marker.length;
  const selected = value.slice(start, end);
  const wrapped =
    value.slice(start - m, start) === marker && value.slice(end, end + m) === marker;
  if (wrapped) {
    return {
      value: value.slice(0, start - m) + selected + value.slice(end + m),
      selectionStart: start - m,
      selectionEnd: end - m,
    };
  }
  const inner = selected || placeholder;
  return {
    value: value.slice(0, start) + marker + inner + marker + value.slice(end),
    selectionStart: start + m,
    selectionEnd: start + m + inner.length,
  };
}

/** Turn the selection (or a placeholder) into a link to `url`. */
export function insertLink(
  value: string,
  start: number,
  end: number,
  url: string
): EditResult | null {
  const href = safeHref(url);
  if (!href) return null;
  const label = value.slice(start, end) || 'link text';
  const md = `[${label}](${href})`;
  return {
    value: value.slice(0, start) + md + value.slice(end),
    selectionStart: start + 1,
    selectionEnd: start + 1 + label.length,
  };
}

/** Start and end offsets of the paragraph (blank-line separated) around a range. */
function paragraphRange(value: string, start: number, end: number): [number, number] {
  const before = value.lastIndexOf('\n\n', Math.max(0, start - 1));
  const s = before === -1 ? 0 : before + 2;
  const after = value.indexOf('\n\n', end);
  const e = after === -1 ? value.length : after;
  return [s, e];
}

/** Set (or clear, for left) the alignment of the paragraph containing the cursor. */
export function setAlignment(
  value: string,
  start: number,
  end: number,
  align: Align
): EditResult {
  const [s, e] = paragraphRange(value, start, end);
  const para = value.slice(s, e);
  const stripped = para.replace(ALIGN_RE, '');
  const next = align === 'left' ? stripped : `::${align} ${stripped}`;
  const delta = next.length - para.length;
  return {
    value: value.slice(0, s) + next + value.slice(e),
    selectionStart: Math.max(s, start + delta),
    selectionEnd: Math.max(s, end + delta),
  };
}

/** Prefix every selected line (e.g. "## " or "- "); remove the prefix if all have it. */
export function toggleLinePrefix(
  value: string,
  start: number,
  end: number,
  prefix: string
): EditResult {
  const lineStart = value.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
  const nl = value.indexOf('\n', end);
  const lineEnd = nl === -1 ? value.length : nl;
  const lines = value.slice(lineStart, lineEnd).split('\n');
  const all = lines.every((l) => l.startsWith(prefix));
  const next = lines
    .map((l) => (all ? l.slice(prefix.length) : l.startsWith(prefix) ? l : prefix + l))
    .join('\n');
  return {
    value: value.slice(0, lineStart) + next + value.slice(lineEnd),
    selectionStart: lineStart,
    selectionEnd: lineStart + next.length,
  };
}

/** Insert an extra vertical gap after the paragraph containing the cursor. */
export function insertSpacer(value: string, end: number): EditResult {
  const after = value.indexOf('\n\n', end);
  const at = after === -1 ? value.length : after;
  const insert = `${at === 0 ? '' : '\n\n'}::space`;
  const next = value.slice(0, at) + insert + value.slice(at);
  const caret = at + insert.length;
  return { value: next, selectionStart: caret, selectionEnd: caret };
}

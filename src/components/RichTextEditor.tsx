'use client';

import { useRef, useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Italic,
  Link2,
  List,
  MoveVertical,
  Palette,
  Strikethrough,
  Type,
  Underline,
} from 'lucide-react';
import RichDescription from '@/components/RichDescription';
import {
  applySpan,
  COLORS,
  insertLink,
  insertSpacer,
  setAlignment,
  SIZES,
  toggleLinePrefix,
  toggleWrap,
  type Align,
  type Color,
  type EditResult,
  type Size,
} from '@/lib/richDescription';

const SWATCH_CLASS: Record<Color, string> = {
  yellow: 'bg-yellow-300',
  orange: 'bg-orange-400',
  red: 'bg-red-400',
  pink: 'bg-pink-400',
  purple: 'bg-purple-400',
  blue: 'bg-blue-400',
  green: 'bg-green-400',
  gray: 'bg-gray-400',
};
const SIZE_LABEL: Record<Size, string> = {
  sm: 'Small',
  lg: 'Large',
  xl: 'Extra large',
};

interface RichTextEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  invalid?: boolean;
}

const toolButton =
  'inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-300 transition-colors hover:bg-gray-700 hover:text-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400';

/**
 * Description editor: a textarea with a formatting toolbar (bold, italic,
 * link, heading, bullets, alignment, spacing) and a live preview. The text it
 * produces is the small Markdown-style format in `lib/richDescription`.
 */
export default function RichTextEditor({
  id,
  value,
  onChange,
  placeholder,
  rows = 6,
  invalid,
}: RichTextEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [linkError, setLinkError] = useState(false);
  // Which picker row (text size / colour) is open under the toolbar.
  const [picker, setPicker] = useState<'size' | 'color' | null>(null);
  // The selection when "Link" was pressed (the URL input steals focus).
  const linkRange = useRef<[number, number]>([0, 0]);

  const apply = (edit: (start: number, end: number) => EditResult | null) => {
    const el = ref.current;
    if (!el) return;
    const result = edit(el.selectionStart, el.selectionEnd);
    if (!result) return;
    onChange(result.value);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  };

  const setSpan = (kind: 'color' | 'size', next: string | null) => {
    apply((s, e) => applySpan(value, s, e, kind, next));
    setPicker(null);
  };

  const align = (a: Align) =>
    apply((s, e) => setAlignment(value, s, e, a));

  const openLink = () => {
    const el = ref.current;
    if (el) linkRange.current = [el.selectionStart, el.selectionEnd];
    setLinkUrl('https://');
    setLinkError(false);
    setLinkOpen(true);
  };

  const submitLink = () => {
    const [s, e] = linkRange.current;
    const result = insertLink(value, s, e, linkUrl);
    if (!result) {
      setLinkError(true);
      return;
    }
    onChange(result.value);
    setLinkOpen(false);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
    const key = event.key.toLowerCase();
    if (key === 'b') {
      event.preventDefault();
      apply((s, e) => toggleWrap(value, s, e, '**'));
    } else if (key === 'i') {
      event.preventDefault();
      apply((s, e) => toggleWrap(value, s, e, '*'));
    } else if (key === 'u') {
      event.preventDefault();
      apply((s, e) => toggleWrap(value, s, e, '__'));
    } else if (key === 'k') {
      event.preventDefault();
      openLink();
    }
  };

  const tools: {
    label: string;
    icon: React.ReactNode;
    run: () => void;
  }[] = [
    {
      label: 'Bold (Ctrl+B)',
      icon: <Bold className="h-4 w-4" />,
      run: () => apply((s, e) => toggleWrap(value, s, e, '**')),
    },
    {
      label: 'Italic (Ctrl+I)',
      icon: <Italic className="h-4 w-4" />,
      run: () => apply((s, e) => toggleWrap(value, s, e, '*')),
    },
    {
      label: 'Underline (Ctrl+U)',
      icon: <Underline className="h-4 w-4" />,
      run: () => apply((s, e) => toggleWrap(value, s, e, '__')),
    },
    {
      label: 'Strikethrough',
      icon: <Strikethrough className="h-4 w-4" />,
      run: () => apply((s, e) => toggleWrap(value, s, e, '~~')),
    },
    {
      label: 'Text size',
      icon: <Type className="h-4 w-4" />,
      run: () => setPicker((p) => (p === 'size' ? null : 'size')),
    },
    {
      label: 'Text colour',
      icon: <Palette className="h-4 w-4" />,
      run: () => setPicker((p) => (p === 'color' ? null : 'color')),
    },
    {
      label: 'Link (Ctrl+K)',
      icon: <Link2 className="h-4 w-4" />,
      run: openLink,
    },
    {
      label: 'Heading',
      icon: <Heading2 className="h-4 w-4" />,
      run: () => apply((s, e) => toggleLinePrefix(value, s, e, '## ')),
    },
    {
      label: 'Bulleted list',
      icon: <List className="h-4 w-4" />,
      run: () => apply((s, e) => toggleLinePrefix(value, s, e, '- ')),
    },
    {
      label: 'Align left',
      icon: <AlignLeft className="h-4 w-4" />,
      run: () => align('left'),
    },
    {
      label: 'Align center',
      icon: <AlignCenter className="h-4 w-4" />,
      run: () => align('center'),
    },
    {
      label: 'Align right',
      icon: <AlignRight className="h-4 w-4" />,
      run: () => align('right'),
    },
    {
      label: 'Add spacing after this paragraph',
      icon: <MoveVertical className="h-4 w-4" />,
      run: () => apply((_s, e) => insertSpacer(value, e)),
    },
  ];

  return (
    <div
      className={`overflow-hidden rounded-lg border bg-gray-800 ${invalid ? 'border-red-500' : 'border-gray-700 focus-within:border-yellow-500'}`}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-700 bg-gray-900/60 px-2 py-1.5">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            disabled={mode === 'preview'}
            onMouseDown={(e) => e.preventDefault()}
            onClick={tool.run}
            className={`${toolButton} disabled:opacity-40`}
          >
            {tool.icon}
          </button>
        ))}
        <div
          className="ml-auto flex gap-1 text-xs"
          role="group"
          aria-label="Editor mode"
        >
          {(['write', 'preview'] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-md px-2.5 py-1 font-medium capitalize ${mode === m ? 'bg-yellow-400 text-black' : 'text-gray-300 hover:bg-gray-700'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {picker === 'size' && mode === 'write' && (
        <div
          role="group"
          aria-label="Text size"
          className="flex flex-wrap items-center gap-1.5 border-b border-gray-700 bg-gray-900/40 px-3 py-2 text-xs"
        >
          <span className="mr-1 text-gray-400">Selected text:</span>
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setSpan('size', size)}
              className="rounded-md border border-gray-600 px-2.5 py-1 text-gray-200 hover:border-yellow-500 hover:text-yellow-300"
            >
              {SIZE_LABEL[size]}
            </button>
          ))}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setSpan('size', null)}
            className="rounded-md px-2.5 py-1 text-gray-400 hover:bg-gray-700"
          >
            Normal
          </button>
        </div>
      )}

      {picker === 'color' && mode === 'write' && (
        <div
          role="group"
          aria-label="Text colour"
          className="flex flex-wrap items-center gap-2 border-b border-gray-700 bg-gray-900/40 px-3 py-2 text-xs"
        >
          <span className="mr-1 text-gray-400">Selected text:</span>
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              title={color}
              aria-label={`Colour ${color}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setSpan('color', color)}
              className={`h-6 w-6 rounded-full border-2 border-gray-900 ring-1 ring-gray-600 hover:ring-yellow-400 ${SWATCH_CLASS[color]}`}
            />
          ))}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setSpan('color', null)}
            className="rounded-md px-2.5 py-1 text-gray-400 hover:bg-gray-700"
          >
            Default
          </button>
        </div>
      )}

      {linkOpen && mode === 'write' && (
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-700 bg-gray-900/40 px-3 py-2">
          <input
            autoFocus
            type="url"
            value={linkUrl}
            onChange={(e) => {
              setLinkUrl(e.target.value);
              setLinkError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submitLink();
              } else if (e.key === 'Escape') {
                setLinkOpen(false);
                ref.current?.focus();
              }
            }}
            aria-label="Link address"
            aria-invalid={linkError}
            placeholder="https://example.com"
            className="min-w-0 flex-1 rounded-md border border-gray-600 bg-gray-800 px-2 py-1 text-sm text-white focus:border-yellow-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={submitLink}
            className="rounded-md bg-yellow-400 px-3 py-1 text-xs font-semibold text-black hover:bg-yellow-500"
          >
            Add link
          </button>
          <button
            type="button"
            onClick={() => setLinkOpen(false)}
            className="rounded-md px-2 py-1 text-xs text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </button>
          {linkError && (
            <p role="alert" className="w-full text-xs text-red-400">
              Enter a link that starts with http://, https:// or mailto:
            </p>
          )}
        </div>
      )}

      {mode === 'write' ? (
        <textarea
          id={id}
          ref={ref}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="block w-full resize-y bg-transparent px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none"
        />
      ) : (
        <div className="min-h-[8rem] px-4 py-3 text-sm text-gray-300">
          <RichDescription
            text={value}
            empty={<p className="text-gray-500">Nothing to preview yet.</p>}
          />
        </div>
      )}
    </div>
  );
}

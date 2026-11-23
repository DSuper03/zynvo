import { Fragment, type ReactNode } from 'react';
import {
  parseDescription,
  type Align,
  type Color,
  type Inline,
  type Size,
} from '@/lib/richDescription';

const ALIGN_CLASS: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

// Literal class names so Tailwind keeps them. Only these fixed values exist,
// so a description can never inject its own CSS.
const COLOR_CLASS: Record<Color, string> = {
  yellow: 'text-yellow-300',
  orange: 'text-orange-400',
  red: 'text-red-400',
  pink: 'text-pink-400',
  purple: 'text-purple-400',
  blue: 'text-blue-400',
  green: 'text-green-400',
  gray: 'text-gray-400',
};
const SIZE_CLASS: Record<Size, string> = {
  sm: 'text-sm',
  lg: 'text-lg',
  xl: 'text-2xl leading-tight',
};

function renderInline(nodes: Inline[]): ReactNode {
  return nodes.map((node, i) => {
    switch (node.t) {
      case 'text':
        return <Fragment key={i}>{node.v}</Fragment>;
      case 'bold':
        return (
          <strong key={i} className="font-semibold text-white">
            {renderInline(node.c)}
          </strong>
        );
      case 'italic':
        return <em key={i}>{renderInline(node.c)}</em>;
      case 'underline':
        return (
          <u key={i} className="underline-offset-2">
            {renderInline(node.c)}
          </u>
        );
      case 'strike':
        return (
          <s key={i} className="opacity-70">
            {renderInline(node.c)}
          </s>
        );
      case 'span':
        return (
          <span
            key={i}
            className={`${node.color ? COLOR_CLASS[node.color] : ''} ${node.size ? SIZE_CLASS[node.size] : ''}`.trim()}
          >
            {renderInline(node.c)}
          </span>
        );
      case 'link':
        return (
          <a
            key={i}
            href={node.href}
            target="_blank"
            rel="noopener noreferrer nofollow ugc"
            className="text-yellow-400 underline underline-offset-2 hover:text-yellow-300"
          >
            {renderInline(node.c)}
          </a>
        );
    }
  });
}

/**
 * Renders an event description (plain text + the small markup in
 * `lib/richDescription`). Builds React elements only, never raw HTML.
 */
export default function RichDescription({
  text,
  className = '',
  empty,
}: {
  text: string;
  className?: string;
  /** Shown when there is no description. */
  empty?: ReactNode;
}) {
  const blocks = parseDescription(text);
  if (blocks.length === 0) return empty ? <>{empty}</> : null;

  return (
    <div className={`space-y-3 break-words leading-relaxed ${className}`}>
      {blocks.map((block, i) => {
        switch (block.t) {
          case 'space':
            return <div key={i} className="h-6" aria-hidden />;
          case 'h':
            return (
              <h3
                key={i}
                className={`text-lg font-semibold text-white ${ALIGN_CLASS[block.align]}`}
              >
                {renderInline(block.c)}
              </h3>
            );
          case 'ul':
            return (
              <ul key={i} className="list-disc space-y-1 pl-5">
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case 'p':
            return (
              <p key={i} className={ALIGN_CLASS[block.align]}>
                {block.lines.map((line, j) => (
                  <Fragment key={j}>
                    {j > 0 && <br />}
                    {renderInline(line)}
                  </Fragment>
                ))}
              </p>
            );
        }
      })}
    </div>
  );
}

import { Fragment, type ReactNode } from 'react';
import {
  parseDescription,
  type Align,
  type Inline,
} from '@/lib/richDescription';

const ALIGN_CLASS: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
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

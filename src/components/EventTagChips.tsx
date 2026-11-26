import Link from 'next/link';
import { readTags, tagHref } from '@/lib/eventTags';

interface EventTagChipsProps {
  tags?: string[] | null;
  /** Show at most this many, plus a "+N" chip. */
  max?: number;
  /** Filter in place (events list). Without it each chip links to /events?tag=… */
  onTagClick?: (tag: string) => void;
  /** The tag currently filtered on, highlighted. */
  activeTag?: string;
  className?: string;
}

const chip =
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors';

/** Small #tag chips for an event. Renders nothing for events without tags. */
export default function EventTagChips({
  tags,
  max,
  onTagClick,
  activeTag,
  className = '',
}: EventTagChipsProps) {
  const list = readTags(tags);
  if (list.length === 0) return null;
  const visible = max ? list.slice(0, max) : list;
  const hidden = list.length - visible.length;

  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Event tags">
      {visible.map((tag) => {
        const tone =
          tag === activeTag
            ? 'bg-yellow-400 text-black'
            : 'bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20';
        return (
          <li key={tag}>
            {onTagClick ? (
              <button
                type="button"
                onClick={() => onTagClick(tag)}
                aria-pressed={tag === activeTag}
                className={`${chip} ${tone}`}
              >
                #{tag}
              </button>
            ) : (
              <Link href={tagHref(tag)} className={`${chip} ${tone}`}>
                #{tag}
              </Link>
            )}
          </li>
        );
      })}
      {hidden > 0 && (
        <li className={`${chip} bg-gray-800 text-gray-400`} aria-label={`${hidden} more tags`}>
          +{hidden}
        </li>
      )}
    </ul>
  );
}

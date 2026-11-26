import type { CustomQuestion } from '@/types/global-Interface';

export const MAX_CUSTOM_QUESTIONS = 10;

export interface SavedQuestion {
  label: string;
  type: 'text' | 'select' | 'url';
  options: string[];
  required: boolean;
  sortOrder: number;
}

const TYPES = ['text', 'select', 'url'] as const;

/** Parse "S, M, L" into trimmed, non-empty options. */
export function parseOptions(text: string): string[] {
  return text
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

/**
 * The shape the server stores: labels trimmed, blank questions dropped,
 * options kept only for dropdowns, order taken from the list position.
 */
export function normalizeQuestions(
  questions: CustomQuestion[] | undefined | null
): SavedQuestion[] {
  return (questions || [])
    .map((q) => ({
      label: String(q?.label ?? '').trim(),
      type: (TYPES as readonly string[]).includes(q?.type)
        ? (q.type as SavedQuestion['type'])
        : 'text',
      options: Array.isArray(q?.options)
        ? q.options.map((o) => String(o).trim()).filter(Boolean)
        : [],
      required: Boolean(q?.required),
    }))
    .filter((q) => q.label)
    .map((q, index) => ({
      ...q,
      options: q.type === 'select' ? q.options : [],
      sortOrder: index,
    }));
}

/** True when the organiser actually changed, added, removed or reordered a question. */
export function questionsChanged(
  current: CustomQuestion[] | undefined | null,
  original: CustomQuestion[] | undefined | null
): boolean {
  return (
    JSON.stringify(normalizeQuestions(current)) !==
    JSON.stringify(normalizeQuestions(original))
  );
}

/** A message for the first problem, or null when the list can be saved. */
export function validateQuestions(
  questions: CustomQuestion[] | undefined | null
): string | null {
  const list = questions || [];
  if (list.length > MAX_CUSTOM_QUESTIONS) {
    return `You can add at most ${MAX_CUSTOM_QUESTIONS} questions.`;
  }
  for (let i = 0; i < list.length; i++) {
    const q = list[i];
    if (!String(q?.label ?? '').trim()) {
      return `Question ${i + 1} needs a label.`;
    }
    if (q.type === 'select' && parseOptions((q.options || []).join(',')).length === 0) {
      return `Question ${i + 1} is a dropdown, so add at least one option.`;
    }
  }
  return null;
}

/** Move an item one place up (-1) or down (+1); returns the same list at the edges. */
export function moveQuestion<T>(list: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (index < 0 || index >= list.length || target < 0 || target >= list.length) {
    return list;
  }
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/**
 * Truncates text to a specified length and adds ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Checks if a string is a valid URL
 * @param text - The text to check
 * @returns boolean indicating if the text is a URL
 */
export const isUrl = (text: string): boolean => {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/;
  return urlRegex.test(text);
};

/**
 * Extracts URLs from text
 * @param text - The text to extract URLs from
 * @returns Array of URLs found in the text
 */
export const extractUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
  return text.match(urlRegex) || [];
};

/**
 * Ensures URL has proper protocol
 * @param url - The URL to normalize
 * @returns URL with proper protocol
 */
export const normalizeUrl = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

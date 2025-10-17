import React from 'react';

interface TextWithLinksProps {
  text: string;
  className?: string;
}

/**
 * Checks if a string is a valid URL
 */
const isUrl = (text: string): boolean => {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/;
  return urlRegex.test(text);
};

/**
 * Ensures URL has proper protocol
 */
const normalizeUrl = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

/**
 * Component that renders text with clickable links
 */
export const TextWithLinks: React.FC<TextWithLinksProps> = ({ text, className = '' }) => {
  if (!text) return <span className={className}>{text}</span>;
  
  // Enhanced URL regex pattern to match various URL formats
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
  
  const parts = text.split(urlRegex);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        // Reset regex lastIndex to ensure proper matching
        urlRegex.lastIndex = 0;
        if (isUrl(part)) {
          const href = normalizeUrl(part);
          
          return (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors break-all"
              onClick={(e) => {
                e.stopPropagation();
              }}
              title={`Open ${part} in new tab`}
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </span>
  );
};

export default TextWithLinks;

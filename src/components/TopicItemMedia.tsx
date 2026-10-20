import type { TopicItem } from '../types/game';
import './TopicItemMedia.css';

export interface ItemMedia {
  type: 'image' | 'emoji';
  value: string;
}

/**
 * Determines if a string is a standard image source (URL, path, data URI, blob URI)
 */
export function isImageSource(src?: string | null): boolean {
  if (!src) return false;
  const s = src.trim();
  // Starts with web protocol, absolute/relative path, data URI, or blob URI
  if (
    s.startsWith('http://') ||
    s.startsWith('https://') ||
    s.startsWith('/') ||
    s.startsWith('./') ||
    s.startsWith('../') ||
    s.startsWith('data:image/') ||
    s.startsWith('blob:')
  ) {
    return true;
  }
  // Check common image file extensions
  if (/\.(png|jpe?g|svg|webp|gif|avif|ico|bmp)(\?.*)?$/i.test(s)) {
    return true;
  }
  return false;
}

/**
 * Resolves whether the topic item has an image or emoji.
 * - Handles `image` being a normal uploaded image path/URL or an emoji string.
 * - Handles `emoji` field.
 * - Returns null if neither is present or non-empty (shows nothing).
 */
export function getItemMedia(item?: TopicItem | null): ItemMedia | null {
  if (!item) return null;

  // 1. Check item.image first
  if (item.image && typeof item.image === 'string' && item.image.trim()) {
    const val = item.image.trim();
    if (isImageSource(val)) {
      return { type: 'image', value: val };
    }
    // If it's not a URL/path, it's an emoji specified in the image field
    return { type: 'emoji', value: val };
  }

  // 2. Check item.emoji
  if (item.emoji && typeof item.emoji === 'string' && item.emoji.trim()) {
    const val = item.emoji.trim();
    if (isImageSource(val)) {
      return { type: 'image', value: val };
    }
    return { type: 'emoji', value: val };
  }

  // 3. No image or emoji -> return null (show nothing)
  return null;
}

interface TopicItemMediaProps {
  item?: TopicItem | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function TopicItemMedia({
  item,
  className = '',
  size = 'md',
}: TopicItemMediaProps) {
  const media = getItemMedia(item);

  // If no image or emoji, show nothing!
  if (!media) {
    return null;
  }

  if (media.type === 'emoji') {
    return (
      <span
        className={`topic-item-emoji size-${size} ${className}`}
        aria-hidden="true"
      >
        {media.value}
      </span>
    );
  }

  return (
    <img
      src={media.value}
      alt={item?.name || 'Topic item'}
      className={`topic-item-img size-${size} ${className}`}
      loading="lazy"
      onError={(e) => {
        // If image fails to load, gracefully hide it
        (e.target as HTMLElement).style.display = 'none';
      }}
    />
  );
}

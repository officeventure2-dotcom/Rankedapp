import React from 'react';
import { bookCoverArt } from '../utils/artwork';

interface BookCoverProps {
  title: string;
  author: string;
  /** Optional hex colour (e.g. the book's coverColor) used as the cover's base. */
  color?: string;
  className?: string;
}

/** An original generated cover, so every book has one without any image files. */
export const BookCover: React.FC<BookCoverProps> = ({ title, author, color, className = '' }) => (
  <img
    src={bookCoverArt(title, author, color)}
    alt={`Cover of ${title} by ${author}`}
    loading="lazy"
    decoding="async"
    className={`aspect-[120/170] object-cover rounded-md shadow-md ${className}`}
  />
);

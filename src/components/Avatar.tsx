import React, { useState } from 'react';
import { avatarArt, isLocalImage } from '../utils/artwork';

interface AvatarProps {
  /** The stored avatar. Remote links and emoji are replaced with generated artwork. */
  src?: string;
  name: string;
  className?: string;
}

/**
 * One avatar for the whole app: a bundled photo when the player has one,
 * otherwise an original illustrated portrait made from their name.
 */
export const Avatar: React.FC<AvatarProps> = ({ src, name, className = '' }) => {
  const [failed, setFailed] = useState(false);
  const useStored = !failed && isLocalImage(src);

  return (
    <img
      src={useStored ? src : avatarArt(name)}
      alt={name}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

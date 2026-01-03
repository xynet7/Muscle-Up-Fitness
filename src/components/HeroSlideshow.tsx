
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { type ImagePlaceholder } from '@/lib/placeholder-images';

interface HeroSlideshowProps {
  images: ImagePlaceholder[];
  interval?: number;
}

export function HeroSlideshow({ images, interval = 5000 }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {images.map((image, index) => (
        <Image
          key={image.id}
          src={image.imageUrl}
          alt={image.description}
          fill
          className={cn(
            'object-cover transition-opacity duration-1000 ease-in-out',
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          )}
          priority={index === 0}
          data-ai-hint={image.imageHint}
        />
      ))}
    </div>
  );
}

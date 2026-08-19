import Image from "next/image";
import type { CSSProperties } from "react";

type CrossfadeImage = {
  src: string;
  alt: string;
  position?: string;
};

interface CrossfadeImagesProps {
  images: CrossfadeImage[];
  className?: string;
  eagerFirst?: boolean;
  imageClassName?: string;
  quality?: number;
  sizes: string;
  intervalSeconds?: number;
}

export default function CrossfadeImages({
  images,
  className = "",
  eagerFirst = false,
  imageClassName = "object-cover",
  quality = 88,
  sizes,
  intervalSeconds = 5,
}: CrossfadeImagesProps) {
  const duration = `${Math.max(images.length, 1) * intervalSeconds}s`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          loading={eagerFirst && index === 0 ? "eager" : undefined}
          quality={quality}
          sizes={sizes}
          className={`crossfade-image-layer ${imageClassName}`}
          style={
            {
              animationDelay: `${index * intervalSeconds}s`,
              animationDuration: duration,
              objectPosition: image.position,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

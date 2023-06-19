import cn from "clsx";
import Image from "next/image";
import { SyntheticEvent, useState } from "react";
import type { ImageProps } from "next/image";
import type { ReactNode } from "react";

type NextImageProps = {
  fallbackSrc?: string;
  alt: string;
  width?: number;
  children?: ReactNode;
  useSkeleton?: boolean;
  imgClassName?: string;
  previewCount?: number;
  blurClassName?: string;
} & ImageProps;

function NextImage({
  src,
  alt,
  width,
  height,
  children,
  className,
  useSkeleton,
  imgClassName,
  previewCount,
  blurClassName,
  fallbackSrc,
}: NextImageProps): JSX.Element {
  const [loading, setLoading] = useState(!!useSkeleton);

  const handleLoad = (): void => setLoading(false);

  const handleError = (
    event: SyntheticEvent<HTMLImageElement, Event>
  ): void => {
    event.currentTarget.src = fallbackSrc || "";
  };

  return (
    <figure style={{ width, height }} className={className}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="rounded-full bg-cover w-full h-full"
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <Image
          className={cn(
            imgClassName,
            loading
              ? blurClassName ?? "animate-pulse bg-light-secondary"
              : previewCount === 1
              ? "!h-auto !min-h-0 !w-auto !min-w-0 rounded-lg object-contain"
              : "object-cover"
          )}
          src={fallbackSrc}
          width={width}
          height={height}
          alt={alt}
          onLoadingComplete={handleLoad}
          layout="responsive"
        />
      )}
      {children}
    </figure>
  );
}

export default NextImage;

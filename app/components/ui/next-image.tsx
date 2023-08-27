/* eslint-disable @next/next/no-img-element */

import cn from "clsx";
import { SyntheticEvent, useState } from "react";
import type { ImageProps } from "next/legacy/image";
import type { ReactNode } from "react";

type NextImageProps = {
  src: string;
  fallbackSrc?: string;
  alt: string;
  width?: string | number;
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
      <img
        src={src}
        alt={alt}
        className={cn(
          imgClassName,
          loading
            ? blurClassName ?? "bg-main-sidebar-background"
            : previewCount === 1
            ? "!h-auto !min-h-0 !w-auto !min-w-0 rounded-lg object-contain"
            : "object-cover"
        )}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
      />
      {children}
    </figure>
  );
}

export default NextImage;

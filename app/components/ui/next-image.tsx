import { useState } from 'react';
import Image from 'next/image';
import cn from 'clsx';
import type { ReactNode } from 'react';
import type { ImageProps } from 'next/image';

type NextImageProps = {
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
                              ...rest
                          }: NextImageProps): JSX.Element {
    const [loading, setLoading] = useState(!!useSkeleton);

    const handleLoad = (): void => setLoading(false);

    return (
        <figure style={{ width }} className={className}>
            <Image
                className={cn(
                    imgClassName,
                    loading
                        ? blurClassName ??
                        'animate-pulse bg-light-secondary dark:bg-dark-secondary'
                        : previewCount === 1
                            ? '!h-auto !min-h-0 !w-auto !min-w-0 rounded-lg object-contain'
                            : 'object-cover'
                )}
                src={src}
                width={width}
                height={height}
                alt={alt}
                onLoadingComplete={handleLoad}
                layout='responsive'
            />
            {children}
        </figure>
    );
}

export default NextImage;
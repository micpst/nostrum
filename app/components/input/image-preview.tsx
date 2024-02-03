import cn from "clsx";
import type { JSX } from "react";
import NextImage from "@/app/components/ui/next-image";

interface IImagePreviewProps {
  urls: string[];
}

type PostImageBorderRadius = Record<number, string[]>;

const postImageBorderRadius: Readonly<PostImageBorderRadius> = {
  1: ["rounded-2xl"],
  2: ["rounded-tl-2xl rounded-bl-2xl", "rounded-tr-2xl rounded-br-2xl"],
  3: ["rounded-tl-2xl rounded-bl-2xl", "rounded-tr-2xl", "rounded-br-2xl"],
  4: ["rounded-tl-2xl", "rounded-tr-2xl", "rounded-bl-2xl", "rounded-br-2xl"],
};

function ImagePreview({ urls }: IImagePreviewProps): JSX.Element {
  const images = urls.slice(0, 4);
  const previewCount = images.length;

  return (
    <div
      className={cn(
        "grid grid-cols-2 grid-rows-2 rounded-2xl mt-2 gap-0.5 w-fit h-fit border-[1px] border-light-border",
        previewCount > 1 && "h-[271px]",
      )}
    >
      {images.map((url, i) => (
        <button
          key={i}
          type="button"
          className={cn(
            "accent-tab relative transition-shadow",
            postImageBorderRadius[previewCount][i],
            {
              "col-span-2 row-span-2": previewCount === 1,
              "row-span-2":
                previewCount === 2 || (i === 0 && previewCount === 3),
            },
          )}
        >
          <NextImage
            className={cn(previewCount > 1 ? "w-full h-full" : "max-h-[500px]")}
            imgClassName={cn(
              "relative cursor-pointer object-cover",
              postImageBorderRadius[previewCount][i],
              previewCount > 1 ? "w-full h-full" : "max-h-[500px]",
            )}
            useSkeleton
            src={url}
            alt="Image preview"
          />
        </button>
      ))}
    </div>
  );
}

export default ImagePreview;

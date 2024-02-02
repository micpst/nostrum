import cn from "clsx";
import { ImagesPreview } from "@/app/lib/types/file";
import NextImage from "@/app/components/ui/next-image";

type ImagePreviewProps = {
  imagesPreview: ImagesPreview;
};

type PostImageBorderRadius = Record<number, string[]>;

const postImageBorderRadius: Readonly<PostImageBorderRadius> = {
  1: ["rounded-2xl"],
  2: ["rounded-tl-2xl rounded-bl-2xl", "rounded-tr-2xl rounded-br-2xl"],
  3: ["rounded-tl-2xl rounded-bl-2xl", "rounded-tr-2xl", "rounded-br-2xl"],
  4: ["rounded-tl-2xl", "rounded-tr-2xl", "rounded-bl-2xl", "rounded-br-2xl"],
};

function ImagePreview({ imagesPreview }: ImagePreviewProps): JSX.Element {
  const images = imagesPreview.slice(0, 4);
  const previewCount = images.length;

  return (
    <div
      className={cn(
        "grid grid-cols-2 grid-rows-2 rounded-2xl mt-2 gap-0.5",
        previewCount > 1 && "h-[271px]",
      )}
    >
      {images.map(({ id, src, alt }, index) => (
        <button
          key={id}
          type="button"
          className={cn(
            "accent-tab relative transition-shadow",
            postImageBorderRadius[previewCount][index],
            {
              "col-span-2 row-span-2": previewCount === 1,
              "row-span-2":
                previewCount === 2 || (index === 0 && previewCount === 3),
            },
          )}
        >
          <NextImage
            className={cn(previewCount > 1 ? "w-full h-full" : "max-h-[500px]")}
            imgClassName={cn(
              "relative cursor-pointer object-cover",
              postImageBorderRadius[previewCount][index],
              previewCount > 1 ? "w-full h-full" : "max-h-[500px]",
            )}
            src={src}
            alt={alt}
          />
        </button>
      ))}
    </div>
  );
}

export default ImagePreview;

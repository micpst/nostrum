import cn from "clsx";
import { ImagesPreview } from "@/app/lib/types/file";

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
  const previewCount = imagesPreview.length;

  return (
    <div className="grid grid-cols-2 grid-rows-2 rounded-2xl mt-2 gap-0.5 h-[42vw] xs:h-[37vw] md:h-[271px]">
      {imagesPreview.map(({ id, src, alt }, index) => (
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
            }
          )}
        >
          <img
            className={cn(
              "relative h-full w-full cursor-pointer object-cover",
              postImageBorderRadius[previewCount][index]
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

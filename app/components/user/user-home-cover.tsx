import NextImage from "@/app/components/ui/next-image";
import type { ImageData } from "@/app/lib/types/file";

type UserHomeCoverProps = {
  coverData?: ImageData;
};

function UserHomeCover({ coverData }: UserHomeCoverProps): JSX.Element {
  return (
    <div className="h-36 xs:h-48 sm:h-52">
      {coverData ? (
        <div className="accent-tab relative h-full w-full rounded-none p-0">
          <NextImage
            useSkeleton
            layout="fill"
            className="h-full w-full"
            imgClassName="object-cover h-full w-full"
            src={coverData.src}
            alt={coverData.alt}
            key={coverData.src}
          />
        </div>
      ) : (
        <div className="h-full bg-light-line-reply" />
      )}
    </div>
  );
}

export default UserHomeCover;

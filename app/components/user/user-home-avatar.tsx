import NextImage from "@/app/components/ui/next-image";
import type { ImageData } from "@/app/lib/types/file";

type UserHomeAvatarProps = {
  src?: string;
};

export function UserHomeAvatar({
  src = "/assets/default_profile.png",
}: UserHomeAvatarProps): JSX.Element {
  return (
    <div className="mb-8 xs:mb-14 sm:mb-16">
      <button
        className="accent-tab absolute -mt-3 aspect-square w-24 -translate-y-1/2 overflow-hidden p-0
                   disabled:cursor-auto disabled:opacity-100 xs:w-32 sm:w-36"
      >
        <NextImage
          useSkeleton
          className="relative h-full w-full bg-main-background border-white border-4 rounded-full"
          imgClassName="rounded-full h-full w-full hover:brightness-75 hover:duration-200"
          src={src}
          alt="avatar"
          fallbackSrc="/assets/default_profile.png"
          layout="fill"
        />
      </button>
    </div>
  );
}

export default UserHomeAvatar;

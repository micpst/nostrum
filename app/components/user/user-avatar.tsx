import cn from "clsx";
import Link from "next/link";
import NextImage from "@/app/components/ui/next-image";

type UserAvatarProps = {
  src?: string;
  size?: number;
  pubkey?: string;
  className?: string;
};

function UserAvatar({
  src,
  size,
  pubkey,
  className,
}: UserAvatarProps): JSX.Element {
  const pictureSize = size ?? 48;
  const pictureSrc = src ?? "";
  return (
    <Link
      href={pubkey ? `user/${pubkey}` : "#"}
      className={cn(
        "blur-picture flex self-start transition hover:brightness-75 hover:duration-200",
        !pubkey && "pointer-events-none",
        className
      )}
      tabIndex={pubkey ? 0 : -1}
    >
      <NextImage
        useSkeleton
        imgClassName="rounded-full"
        width={pictureSize}
        height={pictureSize}
        src={pictureSrc}
        fallbackSrc="/assets/default_profile.png"
        alt="user avatar"
        key={src}
      />
    </Link>
  );
}

export default UserAvatar;

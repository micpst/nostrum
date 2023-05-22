import cn from "clsx";
import Link from "next/link";
import NextImage from "@/app/components/ui/next-image";

type UserAvatarProps = {
  src: string;
  alt: string;
  size?: number;
  npub?: string;
  className?: string;
};

function UserAvatar({
  src,
  alt,
  size,
  npub,
  className,
}: UserAvatarProps): JSX.Element {
  const pictureSize = size ?? 48;
  return (
    <Link
      href={npub ? `/${npub}` : "#"}
      className={cn(
        "blur-picture flex self-start transition hover:brightness-75 hover:duration-200",
        !npub && "pointer-events-none",
        className
      )}
      tabIndex={npub ? 0 : -1}
    >
      <NextImage
        useSkeleton
        imgClassName="rounded-full"
        width={pictureSize}
        height={pictureSize}
        src={src}
        alt={alt}
        key={src}
      />
    </Link>
  );
}

export default UserAvatar;

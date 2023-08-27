import cn from "clsx";
import Link from "next/link";
import { nip19 } from "nostr-tools";
import NextImage from "@/app/components/ui/next-image";

type UserAvatarProps = {
  src?: string;
  size?: number;
  pubkey?: string;
  className?: string;
};

function UserAvatar({
  src,
  size = 48,
  pubkey,
  className,
}: UserAvatarProps): JSX.Element {
  const CustomTag = pubkey ? Link : "div";
  return (
    <CustomTag
      href={pubkey ? `u/${nip19.npubEncode(pubkey)}` : ""}
      className={cn(
        "blur-picture flex self-start transition hover:brightness-75 hover:duration-200",
        !pubkey && "pointer-events-none",
        className
      )}
      tabIndex={pubkey ? 0 : -1}
    >
      <NextImage
        useSkeleton
        imgClassName="rounded-full bg-cover w-full h-full"
        width={size}
        height={size}
        src={src || "/assets/default_profile.png"}
        fallbackSrc="/assets/default_profile.png"
        alt="avatar"
        key={src}
      />
    </CustomTag>
  );
}

export default UserAvatar;

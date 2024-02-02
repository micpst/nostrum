import cn from "clsx";
import Link from "next/link";

type LoginButtonProps = {
  text: string;
  href: string;
  className?: string;
  onClick?: () => void;
};

function LoginButton({ text, className, href }: LoginButtonProps): JSX.Element {
  return (
    <Link
      href={href}
      className={cn(
        "p-2.5 rounded-full border-[1px] border-black font-bold text-center",
        className,
      )}
      target="blank"
    >
      {text}
    </Link>
  );
}

export default LoginButton;

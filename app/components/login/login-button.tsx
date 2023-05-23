import cn from "clsx";

type LoginButtonProps = {
  text: string;
  className?: string;
  onClick?: () => void;
};

function LoginButton({
  text,
  className,
  onClick,
}: LoginButtonProps): JSX.Element {
  return (
    <button
      className={cn(
        "p-2.5 rounded-full border-[1px] border-black font-bold",
        className
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default LoginButton;

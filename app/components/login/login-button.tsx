import cn from "clsx";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useExtension } from "@/app/lib/hooks/useExtension";

type LoginButtonProps = {
  text: string;
  className?: string;
};

function LoginButton({ text, className }: LoginButtonProps): JSX.Element {
  const { login } = useAuth();
  const { isAvailable } = useExtension();

  return (
    <button
      className={cn(
        "p-2.5 rounded-full border-[1px] border-black font-bold",
        !isAvailable && "opacity-60",
        className
      )}
      onClick={login}
      disabled={!isAvailable}
    >
      {text}
    </button>
  );
}

export default LoginButton;

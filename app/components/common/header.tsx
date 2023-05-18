import cn from "clsx";

type HeaderProps = {
  title: string;
  sticky?: boolean;
  border?: boolean;
};

function Header({ title, sticky, border }: HeaderProps): JSX.Element {
  return (
    <header
      className={cn(
        "flex py-4 px-3 z-50 bg-opacity-75 backdrop-blur-md",
        sticky && "sticky top-0",
        border && "border-b bg-white"
      )}
    >
      <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
    </header>
  );
}

export default Header;

type HeaderProps = {
  title: string;
};

function Header({ title }: HeaderProps): JSX.Element {
  return (
    <header className="sticky top-0 flex py-4 px-3 z-50 border-b bg-white bg-opacity-75 bg-opacity-75 backdrop-blur-md">
      <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
    </header>
  );
}

export default Header;

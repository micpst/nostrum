export const metadata = {
  title: "Page not found / Nostrum",
};

function NotFound(): JSX.Element {
  return (
    <div className="w-full mt-20">
      <p className="text-center text-light-secondary">
        Hmm...this page doesn’t exist. Try searching for something else.
      </p>
    </div>
  );
}

export default NotFound;

import CustomIcon from "@/app/components/ui/icon";

function Placeholder(): JSX.Element {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <i>
        <CustomIcon
          className="h-20 w-20 fill-main-accent"
          iconName="NostrumIcon"
        />
      </i>
    </main>
  );
}

export default Placeholder;

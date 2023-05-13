import Link from "next/link";
import CustomIcon from "@/app/components/ui/icon";

function Logo() {
  return (
    <h1>
      <Link
        className="flex items-center justify-center p-3 rounded-full hover:bg-gray-100"
        href="/"
      >
        <CustomIcon
          className="h-7 w-7 fill-violet-700"
          iconName="NostrumIcon"
        />
      </Link>
    </h1>
  );
}

export default Logo;

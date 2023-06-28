import cn from "clsx";
import type { ReactNode } from "react";
import Header from "@/app/components/common/header";
import Button from "@/app/components/ui/button";
import type { User } from "@/app/lib/types/user";

type EditProfileModalProps = Pick<User, "name" | "picture" | "banner"> & {
  loading: boolean;
  children: ReactNode;
  inputNameError: string;
  closeModal: () => void;
  updateData: () => Promise<void>;
};

export function EditProfileModal({
  loading,
  children,
  inputNameError,
  closeModal,
  updateData,
}: EditProfileModalProps): JSX.Element {
  return (
    <>
      <Header
        useActionButton
        iconName="CloseIcon"
        tip="Close"
        className="absolute flex w-full items-center gap-6 rounded-tl-2xl"
        title="Edit profile"
        action={closeModal}
      >
        <div className="ml-auto flex items-center gap-3">
          <Button
            className="bg-light-primary py-1 px-4 font-bold text-white focus-visible:bg-light-primary/90
                       enabled:hover:bg-light-primary/90 enabled:active:bg-light-primary/80 disabled:brightness-75"
            onClick={updateData}
            disabled={!!inputNameError}
            loading={loading}
          >
            Save
          </Button>
        </div>
      </Header>
      <section
        className={cn(
          "h-full transition-opacity",
          loading && "pointer-events-none opacity-50"
        )}
      >
        <div className="relative flex flex-col gap-6 px-4 pt-3 pb-4">
          {children}
        </div>
      </section>
    </>
  );
}

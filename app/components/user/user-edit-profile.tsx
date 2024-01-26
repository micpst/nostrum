import Button from "@/app/components/ui/button";
import { useModal } from "@/app/lib/hooks/useModal";
import type { EditableData, User } from "@/app/lib/types/user";
import { useState } from "react";
import type { EditableUserData } from "@/app/lib/types/user";
import cn from "clsx";
import Modal from "@/app/components/modal/modal";
import { EditProfileModal } from "@/app/components/modal/edit-profile-modal";
import type { InputFieldProps } from "@/app/components/input/input-field";
import { InputField } from "@/app/components/input/input-field";
import { useRelay } from "@/app/lib/context/relay-provider";
import { useProfile } from "@/app/lib/context/profile-provider";
import type { ChangeEvent, KeyboardEvent } from "react";
import NostrService from "@/app/lib/services/nostrService";

type RequiredInputFieldProps = Omit<InputFieldProps, "handleChange"> & {
  inputId: EditableData;
};

type UserEditProfileProps = {
  user: User;
  hide?: boolean;
};

function UserEditProfile({ hide, user }: UserEditProfileProps): JSX.Element {
  const { open, openModal, closeModal } = useModal();
  const { set: setProfile } = useProfile();
  const { about, name, picture, banner, nip05 } = user;
  const [editUserData, setEditUserData] = useState<EditableUserData>({
    about,
    name,
    picture,
    banner,
    nip05,
  });

  const inputFields: Readonly<RequiredInputFieldProps[]> = [
    {
      label: "Name",
      inputId: "name",
      inputValue: editUserData.name,
      inputLimit: 50,
    },
    {
      label: "NIP-05",
      inputId: "nip05",
      inputValue: editUserData.nip05,
      inputLimit: 30,
    },
    {
      label: "About",
      inputId: "about",
      inputValue: editUserData.about,
      inputLimit: 160,
      useTextArea: true,
    },
    {
      label: "Picture",
      inputId: "picture",
      inputValue: editUserData.picture,
      inputLimit: 200,
    },
    {
      label: "Banner",
      inputId: "banner",
      inputValue: editUserData.banner,
      inputLimit: 200,
    },
  ];

  const handleChange =
    (key: EditableData) =>
    ({
      target: { value },
    }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setEditUserData({ ...editUserData, [key]: value });

  const handleKeyboardShortcut = ({
    key,
    ctrlKey,
  }: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (ctrlKey && key === "Enter") {
      updateData();
    }
  };

  const updateData = (): void => {
    if (!user) return;

    const trimmedKeys: Readonly<EditableData[]> = [
      "name",
      "about",
      "banner",
      "picture",
      "nip05",
    ];
    const newUserData = trimmedKeys.reduce(
      (acc, curr) => ({ ...acc, [curr]: editUserData[curr]?.trim() ?? null }),
      {} as EditableUserData
    );

    setProfile(newUserData);
    closeModal();
  };

  return (
    <form className={cn(hide && "hidden md:block")}>
      <Modal
        modalClassName="relative bg-main-background rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
        open={open}
        closeModal={closeModal}
      >
        <EditProfileModal closeModal={closeModal} updateData={updateData}>
          {inputFields.map((inputData) => (
            <InputField
              {...inputData}
              handleChange={handleChange(inputData.inputId)}
              handleKeyboardShortcut={handleKeyboardShortcut}
              key={inputData.inputId}
            />
          ))}
        </EditProfileModal>
      </Modal>
      <Button
        className="dark-bg-tab self-start border border-light-line-reply px-4 py-1.5 font-bold
                   hover:bg-light-primary/10 active:bg-light-primary/20"
        onClick={openModal}
      >
        Edit profile
      </Button>
    </form>
  );
}
export default UserEditProfile;

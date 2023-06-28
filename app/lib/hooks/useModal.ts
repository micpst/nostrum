import { useState } from "react";

type UseModal = {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export function useModal(): UseModal {
  const [open, setOpen] = useState<boolean>(false);

  const openModal = (): void => setOpen(true);
  const closeModal = (): void => setOpen(false);

  return { open, openModal, closeModal };
}

import { useEffect } from "react";
import { closeModal, openModal } from "@s/util/functions";
import { nanoid } from "@reduxjs/toolkit";

export const useScrollLock = (open: boolean, id = nanoid()) => {
  useEffect(() => {
    if (open) {
      openModal(id);
    } else {
      closeModal(id);
    }
  }, [open]);
};

export default useScrollLock;

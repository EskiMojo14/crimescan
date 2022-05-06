import { useEffect } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { closeModal, openModal } from "@s/util/functions";

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

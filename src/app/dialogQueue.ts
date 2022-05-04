import { createDialogQueue, DialogQueueInput } from "@rmwc/dialog";
import classNames from "classnames";

export const queue = createDialogQueue();

export const { alert, confirm, prompt } = queue;

export const confirmDelete = (dialog: DialogQueueInput) =>
  confirm(
    Object.assign(dialog, {
      acceptLabel: dialog.acceptLabel ?? "Delete",
      className: classNames(dialog.className, "mdc-dialog--delete-confirm"),
    })
  );

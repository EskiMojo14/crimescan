import { createSnackbarQueue } from "@rmwc/snackbar";

export const queue = createSnackbarQueue();

export const { notify } = queue;

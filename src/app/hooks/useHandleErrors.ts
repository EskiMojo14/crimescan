import { useEffect } from "react";

export const useHandleErrors = <Error>(
  handleError: (error: Error, errorCount: number) => void,
  ...errors: (Error | undefined)[]
) => {
  useEffect(() => {
    let errorCount = 0;
    for (const error of errors) {
      if (error) {
        errorCount += 1;
        handleError(error, errorCount);
      }
    }
  }, [...errors, handleError]);
};

export default useHandleErrors;

import { forwardRef } from "react";
import { useVersionSelector } from "../../context/useSelectors";
import { useUpdateDownloaded } from "../../hooks";
import type { TComponentGenericForwardRef } from "./types";

export const DownloadedButton = forwardRef(
  ({ component: Component, children, ...otherProps }, ref) => {
    const version = useVersionSelector();
    const { handleUpdate } = useUpdateDownloaded();

    if (version !== "update-downloaded") {
      return null;
    }

    return (
      <Component onClick={handleUpdate} ref={ref} {...otherProps}>
        {children}
        {` v${version}`}
      </Component>
    );
  }
) as TComponentGenericForwardRef;

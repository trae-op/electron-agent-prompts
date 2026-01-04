import { useContext } from "react";

import { Context } from "./Context";

export const useConverterContext = () => {
  const converterContext = useContext(Context);

  if (!converterContext) {
    throw new Error("Converter context must be used within Provider");
  }

  return converterContext;
};

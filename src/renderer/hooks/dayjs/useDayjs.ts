import { useEffect, useState } from "react";
import { TDayjs } from "./types";

let cachedDayjs: TDayjs = undefined;

export function useDayjs() {
  const [isLoaded, setLoaded] = useState(() => cachedDayjs !== undefined);

  useEffect(() => {
    if (cachedDayjs !== undefined) {
      return;
    }

    import("dayjs").then((mod) => {
      const instance = mod.default || mod;
      cachedDayjs = instance;
      setLoaded(true);
    });
  }, []);

  if (!isLoaded) {
    return undefined;
  }

  return cachedDayjs;
}

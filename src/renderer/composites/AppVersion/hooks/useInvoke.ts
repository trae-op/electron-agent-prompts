import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import type { THookInvoke } from "./types";

export const useInvoke = (): THookInvoke => {
  const [version, setVersion] = useState("");
  const isSubscribe = useRef(true);

  const subscribe = useCallback(() => {
    window.electron.invoke.getVersion().then((value) => {
      setVersion((prevValue) => (prevValue === value ? prevValue : value));
    });
  }, []);

  useEffect(() => {
    if (isSubscribe.current) {
      isSubscribe.current = false;
      subscribe();
    }
  }, [subscribe]);

  return useMemo(() => ({ version }), [version]);
};

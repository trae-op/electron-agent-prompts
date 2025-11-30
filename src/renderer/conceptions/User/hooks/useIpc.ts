import { useEffect } from "react";
import { useSetUserDispatch } from "../context/useSelectors";

export const useIpc = () => {
  const setUser = useSetUserDispatch();

  useEffect(() => {
    window.electron.send.user();
  }, []);

  useEffect(() => {
    const unSub = window.electron.receive.subscribeUser(({ user }) => {
      setUser(user);
    });

    return unSub;
  }, []);
};

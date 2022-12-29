import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LocalUser } from "@/types";
import { useAppSelector } from "./../store/hooks";

export const useAuthHooks = () => {
  const { user } = useAppSelector(({ app }) => app);

  const handleStoreUserData = async (userData: LocalUser) => {
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
  };

  useEffect(() => {
    if (!!user) {
      handleStoreUserData(user);
    }
  }, [user]);
};

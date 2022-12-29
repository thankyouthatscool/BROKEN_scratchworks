import { useEffect, useRef } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";

import { CustomDrawer } from "@components/CustomDrawer";
import { AuthScreen } from "@screens/AuthScreen";
import { HomeScreen } from "@screens/HomeScreen";

import { useAppDispatch, useAppSelector, useAuthHooks, useToast } from "@hooks";
import { clearUser, setUser } from "@store";
import { SPLASH_SCREEN_DELAY } from "@theme";
import { LocalUser, RootNavigatorProps } from "@types";
import { trpc } from "@utils";

const RootNavigator = createDrawerNavigator<RootNavigatorProps>();

export const AppRoot = () => {
  useAuthHooks();

  const { showToast } = useToast();

  const dispatch = useAppDispatch();

  const { user } = useAppSelector(({ app }) => app);

  const initialLoadRef = useRef<boolean>(false);

  const { mutateAsync: verifyTokenMutateAsync } =
    trpc.inertiion.auth.verifyToken.useMutation();

  const handleInitialLoad = async () => {
    const userDataString = await AsyncStorage.getItem("userData");
    const token = await SecureStore.getItemAsync("token");

    if (!!userDataString) {
      const userData = JSON.parse(userDataString) as LocalUser;

      dispatch(setUser(userData));
    }

    (() => {
      setTimeout(async () => {
        await SplashScreen.hideAsync();
      }, SPLASH_SCREEN_DELAY);
    })();

    if (!!token) {
      const res = await verifyTokenMutateAsync(token);

      if (typeof res === "string") {
        showToast({ message: res });

        await AsyncStorage.removeItem("userData");
        await SecureStore.deleteItemAsync("token");

        dispatch(clearUser());
      } else {
        showToast({ message: "👌", options: { duration: 250 } });
      }
    }
  };

  useEffect(() => {
    if (!initialLoadRef.current) {
      handleInitialLoad();
    }

    initialLoadRef.current = true;
  }, [initialLoadRef]);

  return (
    <RootNavigator.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      initialRouteName="AuthScreen"
      screenOptions={{ headerShown: false }}
    >
      {!user && (
        <RootNavigator.Screen
          component={AuthScreen}
          name="AuthScreen"
          options={{ title: "Login" }}
        />
      )}
      {!!user && (
        <RootNavigator.Screen
          component={HomeScreen}
          name="HomeScreen"
          options={{ title: "Home" }}
        />
      )}
    </RootNavigator.Navigator>
  );
};

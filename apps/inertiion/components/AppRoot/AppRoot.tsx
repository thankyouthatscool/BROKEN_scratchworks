import { createDrawerNavigator } from "@react-navigation/drawer";

import { CustomDrawer } from "@components/CustomDrawer";
import { AuthScreen } from "@screens/AuthScreen";
import { HomeScreen } from "@screens/HomeScreen";
import { RootNavigatorProps } from "@types";

const RootNavigator = createDrawerNavigator<RootNavigatorProps>();

export const AppRoot = () => {
  return (
    <RootNavigator.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      initialRouteName="AuthScreen"
      screenOptions={{ headerShown: false }}
    >
      <RootNavigator.Screen
        component={AuthScreen}
        name="AuthScreen"
        options={{ title: "Login" }}
      />
      <RootNavigator.Screen
        component={HomeScreen}
        name="HomeScreen"
        options={{ title: "Home" }}
      />
    </RootNavigator.Navigator>
  );
};

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreenRoot } from "@screens/HomeScreen/HomeScreenRoot";
import { OrdersScreen } from "@screens/OrdersScreen";
import type { HomeScreenNavigatorProps } from "@types";

const HomeScreenNavigator =
  createNativeStackNavigator<HomeScreenNavigatorProps>();

export const HomeScreen = () => {
  return (
    <HomeScreenNavigator.Navigator
      initialRouteName="HomeScreenRoot"
      screenOptions={{ animation: "slide_from_right", headerShown: false }}
    >
      <HomeScreenNavigator.Screen
        component={HomeScreenRoot}
        name="HomeScreenRoot"
      />
      <HomeScreenNavigator.Screen
        component={OrdersScreen}
        name="OrdersScreen"
      />
    </HomeScreenNavigator.Navigator>
  );
};

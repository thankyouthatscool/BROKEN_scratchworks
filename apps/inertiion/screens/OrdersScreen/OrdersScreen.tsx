import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { OrdersScreenRoot } from "@screens/OrdersScreen/OrdersScreenRoot";
import { OrdersScreenNavigatorProps } from "@types";

const OrderScreenStack =
  createNativeStackNavigator<OrdersScreenNavigatorProps>();

export const OrdersScreen = () => {
  return (
    <OrderScreenStack.Navigator
      initialRouteName="OrdersScreenRoot"
      screenOptions={{ animation: "slide_from_right", headerShown: false }}
    >
      <OrderScreenStack.Screen
        component={OrdersScreenRoot}
        name="OrdersScreenRoot"
      />
    </OrderScreenStack.Navigator>
  );
};

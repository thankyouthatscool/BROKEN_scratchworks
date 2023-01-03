import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { EditOrderScreen } from "./EditOrderScreen";
import { NewOrderScreen } from "@screens/OrdersScreen/NewOrderScreen";
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
        component={EditOrderScreen}
        name="EditOrderScreen"
      />
      <OrderScreenStack.Screen
        component={OrdersScreenRoot}
        name="OrdersScreenRoot"
      />
      <OrderScreenStack.Screen
        component={NewOrderScreen}
        name="NewOrderScreen"
      />
    </OrderScreenStack.Navigator>
  );
};

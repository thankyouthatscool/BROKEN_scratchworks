import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ForgotPasswordScreen } from "@screens/AuthScreen/ForgotPasswordScreen";
import { LoginScreen } from "@screens/AuthScreen/LoginScreen";
import { SignUpScreen } from "@screens/AuthScreen/SignUpScreen";
import type { AuthScreenNavigatorProps } from "@types";

const AuthScreenNavigator =
  createNativeStackNavigator<AuthScreenNavigatorProps>();

export const AuthScreen = () => {
  return (
    <AuthScreenNavigator.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{ animation: "slide_from_right", headerShown: false }}
    >
      <AuthScreenNavigator.Screen
        component={ForgotPasswordScreen}
        name="ForgotPasswordScreen"
      />
      <AuthScreenNavigator.Screen component={LoginScreen} name="LoginScreen" />
      <AuthScreenNavigator.Screen
        component={SignUpScreen}
        name="SignUpScreen"
      />
    </AuthScreenNavigator.Navigator>
  );
};

import type { DrawerScreenProps } from "@react-navigation/drawer";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

// Navigators
export type RootNavigatorProps = {
  AuthScreen: undefined;
  HomeScreen: undefined;
  SettingsScreen: undefined;
};

export type AuthScreenNavigatorProps = {
  ForgotPasswordScreen: { email?: string };
  LoginScreen: { email?: string };
  SignUpScreen: { email?: string };
};

export type HomeScreenNavigatorProps = {
  HomeScreenRoot: undefined;
  OrdersScreen: undefined;
  PickOrderScreen: undefined;
};

export type OrdersScreenNavigatorProps = {
  NewOrderScreen: undefined;
  OrdersScreenRoot: undefined;
};

// Screens
// Auth
export type LoginScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthScreenNavigatorProps, "LoginScreen">,
  DrawerScreenProps<RootNavigatorProps>
>;

export type SignUpScreenProps = CompositeScreenProps<
  CompositeScreenProps<
    NativeStackScreenProps<AuthScreenNavigatorProps, "SignUpScreen">,
    DrawerScreenProps<RootNavigatorProps>
  >,
  HomeScreenRootProps
>;

export type ForgotPasswordScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthScreenNavigatorProps, "ForgotPasswordScreen">,
  DrawerScreenProps<RootNavigatorProps>
>;

// Home
export type HomeScreenRootProps = CompositeScreenProps<
  NativeStackScreenProps<HomeScreenNavigatorProps, "HomeScreenRoot">,
  DrawerScreenProps<RootNavigatorProps>
>;

// Orders
export type OrdersScreenRootProps = CompositeScreenProps<
  CompositeScreenProps<
    NativeStackScreenProps<OrdersScreenNavigatorProps, "OrdersScreenRoot">,
    DrawerScreenProps<RootNavigatorProps>
  >,
  HomeScreenRootProps
>;

export type NewOrderScreenRootProps = CompositeScreenProps<
  CompositeScreenProps<
    NativeStackScreenProps<OrdersScreenNavigatorProps, "NewOrderScreen">,
    DrawerScreenProps<RootNavigatorProps>
  >,
  HomeScreenRootProps
>;

import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppRoot } from "@components";
import { GRAY_100 } from "@theme";

export const App = () => {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, background: GRAY_100 },
      }}
    >
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AppRoot />
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

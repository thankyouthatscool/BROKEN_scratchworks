import { useState } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import { AppRoot } from "@components";
import { store } from "@store";
import { GRAY_100 } from "@theme";
import { trpc } from "@utils";

SplashScreen.preventAutoHideAsync();

export const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({ url: `${Constants.expoConfig?.extra?.API_URL}/trpc` }),
      ],
    })
  );

  return (
    <ReduxProvider store={store}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer
            theme={{
              ...DefaultTheme,
              colors: { ...DefaultTheme.colors, background: GRAY_100 },
            }}
          >
            <SafeAreaProvider>
              <RootSiblingParent>
                <StatusBar style="auto" />
                <AppRoot />
              </RootSiblingParent>
            </SafeAreaProvider>
          </NavigationContainer>
        </QueryClientProvider>
      </trpc.Provider>
    </ReduxProvider>
  );
};

import UUID from "react-native-uuid";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";

import { AppRoot } from "@components/AppRoot";
import { trpc } from "@utils/trpc";

export const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `https://scratchworks.duckdns.org/trpc`,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <View>
          <StatusBar style="auto" />
          {/* <AppRoot /> */}
        </View>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

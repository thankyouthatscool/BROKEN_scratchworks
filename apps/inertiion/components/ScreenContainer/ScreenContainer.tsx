import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { APP_PADDING } from "@theme";

export const ScreenContainer = ({ children }: { children: ReactNode }) => {
  return (
    <SafeAreaView style={{ padding: APP_PADDING, position: "relative" }}>
      {children}
    </SafeAreaView>
  );
};

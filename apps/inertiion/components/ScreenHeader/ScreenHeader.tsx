import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { APP_PADDING } from "@/theme";

export const ScreenHeader = ({ children }: { children: ReactNode }) => {
  return <View style={{ marginBottom: APP_PADDING }}>{children}</View>;
};

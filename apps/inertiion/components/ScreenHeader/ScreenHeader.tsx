import type { ReactNode, ComponentPropsWithoutRef } from "react";
import { View } from "react-native";

import { APP_PADDING } from "@/theme";

export const ScreenHeader = ({
  children,
  ...props
}: { children: ReactNode } & ComponentPropsWithoutRef<typeof View>) => {
  return (
    <View {...props} style={{ marginBottom: APP_PADDING }}>
      {children}
    </View>
  );
};

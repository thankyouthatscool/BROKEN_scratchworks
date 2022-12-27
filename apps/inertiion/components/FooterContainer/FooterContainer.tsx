import { ReactNode, useState } from "react";
import { Dimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { APP_PADDING } from "@theme";

const { height, width } = Dimensions.get("window");

export const FooterContainer = ({ children }: { children?: ReactNode }) => {
  const { top } = useSafeAreaInsets();

  const [positionOffset, setPositionOffset] = useState<number>(0);

  return (
    <View
      onLayout={(e) => {
        const { height } = e.nativeEvent.layout;

        setPositionOffset(() => height);
      }}
      style={{
        position: "absolute",
        left: 0,
        padding: APP_PADDING,
        top: height - positionOffset + top,
        width,
      }}
    >
      {children}
    </View>
  );
};

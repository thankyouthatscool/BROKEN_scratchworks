import { ComponentPropsWithoutRef } from "react";
import { TextInput, View } from "react-native";

import { APP_PADDING, GRAY_400, GRAY_600 } from "@theme";

export const TextBlockBase = ({
  style,
  ...props
}: ComponentPropsWithoutRef<typeof TextInput>) => {
  return (
    <View
      style={{
        // @ts-ignore
        ...style,
        backgroundColor: "white",
        padding: APP_PADDING,
      }}
    >
      <TextInput
        {...props}
        multiline
        numberOfLines={5}
        placeholderTextColor={GRAY_400}
        style={{
          color: GRAY_600,
          textAlignVertical: "top",
        }}
      />
    </View>
  );
};

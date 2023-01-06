import { ComponentPropsWithoutRef } from "react";
import { TextInput } from "react-native";

import { APP_PADDING, GRAY_400, GRAY_600 } from "@theme";

export const TextBlockBase = ({
  style,
  ...props
}: ComponentPropsWithoutRef<typeof TextInput>) => {
  return (
    <TextInput
      {...props}
      multiline
      numberOfLines={5}
      placeholderTextColor={GRAY_400}
      style={{
        // @ts-ignore
        ...style,
        backgroundColor: "white",
        color: GRAY_600,
        padding: APP_PADDING,
        textAlignVertical: "top",
      }}
    />
  );
};

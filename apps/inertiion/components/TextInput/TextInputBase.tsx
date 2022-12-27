import { ComponentPropsWithoutRef } from "react";
import { TextInput } from "react-native";

import {
  GRAY_400,
  GRAY_600,
  TEXT_INPUT_PADDING,
  TEXT_INPUT_FONT_SIZE_SMALL,
  TEXT_INPUT_FONT_SIZE_DEFAULT,
  TEXT_INPUT_FONT_SIZE_LARGE,
} from "@theme";

export const TextInputBase = ({
  size,
  ...props
}: { size?: "sm" | "default" | "lg" } & ComponentPropsWithoutRef<
  typeof TextInput
>) => {
  return (
    <TextInput
      {...props}
      placeholderTextColor={GRAY_400}
      style={{
        // @ts-ignore
        ...props.style,
        backgroundColor: "white",
        color: GRAY_600,
        fontSize:
          size === "lg"
            ? TEXT_INPUT_FONT_SIZE_LARGE
            : size === "sm"
            ? TEXT_INPUT_FONT_SIZE_SMALL
            : TEXT_INPUT_FONT_SIZE_DEFAULT,
        padding: TEXT_INPUT_PADDING,
      }}
    />
  );
};

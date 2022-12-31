import { ComponentPropsWithoutRef, useState } from "react";
import { Pressable, Text } from "react-native";

import {
  APP_PADDING,
  BORDER_RADIUS,
  BUTTON_TEXT_SIZE_SMALL,
  BUTTON_TEXT_SIZE_DEFAULT,
  BUTTON_TEXT_SIZE_LARGE,
  GRAY_200,
  GRAY_600,
  GRAY_700,
} from "@theme";

export const ButtonBase = ({
  children,
  disabled,
  marginBottom,
  marginRight,
  size,
  title,
  style,
  type,
  ...props
}: {
  size?: "sm" | "default" | "lg";
  marginBottom?: boolean;
  marginRight?: boolean;
  type?: "primary" | "secondary" | "danger";
  title: string;
} & ComponentPropsWithoutRef<typeof Pressable>) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);

  return (
    <Pressable
      {...props}
      disabled={disabled}
      onPressIn={() => {
        setIsPressed(() => true);
      }}
      onPressOut={() => {
        setIsPressed(() => false);
      }}
      style={({ pressed }) => ({
        // @ts-ignore
        ...style,
        backgroundColor:
          type === "danger"
            ? disabled
              ? GRAY_200
              : pressed
              ? "red"
              : "red"
            : type === "secondary"
            ? disabled
              ? GRAY_200
              : "white"
            : disabled
            ? GRAY_200
            : pressed
            ? GRAY_700
            : GRAY_600,
        borderColor:
          type === "danger"
            ? disabled
              ? GRAY_200
              : "red"
            : type === "secondary"
            ? disabled
              ? GRAY_200
              : pressed
              ? GRAY_700
              : GRAY_600
            : disabled
            ? GRAY_200
            : pressed
            ? GRAY_700
            : GRAY_600,
        borderRadius: BORDER_RADIUS,
        borderWidth: 2,
        marginBottom: marginBottom ? APP_PADDING : 0,
        marginRight: marginRight ? APP_PADDING : 0,

        padding: APP_PADDING,
      })}
    >
      <Text
        style={{
          color:
            type === "secondary" ? (isPressed ? GRAY_700 : GRAY_600) : "white",
          fontSize:
            size === "sm"
              ? BUTTON_TEXT_SIZE_SMALL
              : size === "lg"
              ? BUTTON_TEXT_SIZE_LARGE
              : BUTTON_TEXT_SIZE_DEFAULT,
          fontWeight: "500",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
};

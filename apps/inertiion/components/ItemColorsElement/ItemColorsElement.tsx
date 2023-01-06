import { ComponentPropsWithoutRef } from "react";
import { View } from "react-native";

import { APP_PADDING } from "@theme";
import { colorLookup } from "@utils";

type ItemColorsElementProps = { colors: string };

const COLOR_ELEMENT_SIZE = 15;

export const ItemColorsElement = ({
  colors,
  ...props
}: ItemColorsElementProps & ComponentPropsWithoutRef<typeof View>) => {
  const colorArray = colors
    .split(",")
    .map((color) => color.trim().toLowerCase());

  return (
    <View
      {...props}
      style={{
        // @ts-ignore
        ...props.style,
        flexDirection: "row",
        width: 80,
      }}
    >
      {colorArray.map((color, index) => {
        return (
          <View
            key={`${color} - ${index}`}
            style={{
              backgroundColor: colorLookup(color).background,
              borderColor: colorLookup(color).border,
              borderWidth: color === "white" || color === "wht" ? 1 : 0,
              borderRadius: 20,
              marginRight: APP_PADDING / 2,
              height: COLOR_ELEMENT_SIZE,
              width: COLOR_ELEMENT_SIZE,
            }}
          />
        );
      })}
    </View>
  );
};

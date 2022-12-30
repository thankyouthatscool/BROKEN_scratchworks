import { HomeScreenRootProps } from "@/types";
import { Pressable, ScrollView, Text } from "react-native";

import OrdersImage from "@assets/order.svg";
import { ScreenContainer } from "@components/ScreenContainer";
import {
  APP_FONT_SIZE,
  APP_PADDING,
  BORDER_RADIUS,
  ELEVATION,
  ELEVATION_PRESSED,
  GRAY_600,
  HOME_SCREEN_IMAGE_WIDTH,
  HOME_SCREEN_TILES_FONT_MULTIPLICATION_FACTOR,
} from "@theme";
import { lookupImageSize } from "@utils";

const { imageHeight, imageWidth } = lookupImageSize("order");

export const HomeScreenRoot = ({ navigation }: HomeScreenRootProps) => {
  return (
    <ScreenContainer>
      <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={() => {
            navigation.navigate("OrdersScreen");
          }}
          style={({ pressed }) => ({
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: BORDER_RADIUS,
            elevation: pressed ? ELEVATION_PRESSED : ELEVATION,
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: APP_PADDING,
            padding: APP_PADDING,
          })}
        >
          <Text
            style={{
              color: GRAY_600,
              fontSize:
                APP_FONT_SIZE * HOME_SCREEN_TILES_FONT_MULTIPLICATION_FACTOR,
            }}
          >
            Orders
          </Text>
          <OrdersImage
            height={100}
            width={(imageWidth / imageHeight) * HOME_SCREEN_IMAGE_WIDTH}
          />
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
};

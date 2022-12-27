import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Text, View } from "react-native";

import {
  APP_FONT_SIZE,
  DRAWER_HEADING_MULTIPLICATION_FACTOR,
  GRAY_600,
} from "@theme";

export const CustomDrawer = (props: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: GRAY_600,
            fontWeight: "bold",
            fontSize: APP_FONT_SIZE * DRAWER_HEADING_MULTIPLICATION_FACTOR,
          }}
        >
          INERTiiON!
        </Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        onPress={() => {
          console.log("Logging out...");
        }}
        label="Logout"
      />
    </DrawerContentScrollView>
  );
};

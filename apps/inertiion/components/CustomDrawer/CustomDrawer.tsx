import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Text, View } from "react-native";

import { useAppDispatch, useAppSelector } from "@hooks";
import { clearUser } from "@store";
import {
  APP_FONT_SIZE,
  DRAWER_HEADING_MULTIPLICATION_FACTOR,
  GRAY_600,
} from "@theme";

export const CustomDrawer = (props: DrawerContentComponentProps) => {
  const { user } = useAppSelector(({ app }) => app);

  const dispatch = useAppDispatch();

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
      {!!user && (
        <DrawerItem
          onPress={async () => {
            await AsyncStorage.removeItem("userData");
            await SecureStore.deleteItemAsync("token");

            dispatch(clearUser());

            props.navigation.closeDrawer();
          }}
          label="Logout"
        />
      )}
    </DrawerContentScrollView>
  );
};

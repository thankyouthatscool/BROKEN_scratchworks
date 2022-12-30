import { ComponentPropsWithoutRef } from "react";
import { Button, Pressable, Text, View } from "react-native";

import { ScreenContainer } from "@components/ScreenContainer";
import { ScreenHeader } from "@components/ScreenHeader";
import { TextInputBase } from "@components/TextInput/TextInputBase";
import { APP_PADDING } from "@/theme";
import { OrdersScreenRootProps } from "@types";

export const OrdersScreenRoot = ({ navigation }: OrdersScreenRootProps) => {
  return (
    <ScreenContainer>
      <ScreenHeader>
        <View>
          <Button
            onPress={() => {
              navigation.goBack();
            }}
            title="Back"
          />
          <View>
            <Button
              onPress={() => {
                navigation.navigate("NewOrderScreen");
              }}
              title="Add"
            />
          </View>
        </View>
      </ScreenHeader>
      <TextInputBase placeholder="Search" />
      {["Pending", "Completed", "Dispatched"].map((item) => (
        <OrderStateCategoryToggle
          key={item}
          onChildPress={(orderId) => {
            console.log(orderId);
          }}
          onPress={() => {
            console.log("expanding or collapsing");
          }}
          title={item}
        />
      ))}
    </ScreenContainer>
  );
};

type OrderStateCategoryToggleProps = {
  onChildPress: (orderId: string) => void;
  title: string;
};

const OrderStateCategoryToggle = ({
  onChildPress,
  title,
  ...props
}: OrderStateCategoryToggleProps &
  ComponentPropsWithoutRef<typeof Pressable>) => {
  return (
    <View>
      <Pressable {...props}>
        <View
          style={{
            borderWidth: 2,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: APP_PADDING,
          }}
        >
          <Text>{title}</Text>
          <Text>10</Text>
        </View>
      </Pressable>
      {[1, 2, 3, 4].map((item) => (
        <Pressable
          onPress={() => {
            onChildPress(item.toString());
          }}
          key={item}
        >
          <Text>Hello</Text>
        </Pressable>
      ))}
    </View>
  );
};

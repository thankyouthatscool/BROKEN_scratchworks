import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ComponentPropsWithoutRef, useState } from "react";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";

import { ButtonBase } from "@components/Button/ButtonBase";
import { ItemColorsElement } from "@components/ItemColorsElement/ItemColorsElement";
import { ScreenHeader } from "@components/ScreenHeader/ScreenHeader";
import { ScreenContainer } from "@components/ScreenContainer";
import { useAppDispatch, useAppSelector } from "@hooks";
import { APP_FONT_SIZE, APP_PADDING, GRAY_600 } from "@theme";
import { OrderDetailsScreenRootProps, OrderProps } from "@types";

type Nav = Pick<OrderDetailsScreenRootProps, "navigation">["navigation"];

export const OrderDetailsScreen = ({
  navigation,
  route,
}: OrderDetailsScreenRootProps) => {
  const { localOrders } = useAppSelector(({ orders }) => orders);

  const [selectedOrder] = useState<OrderProps | undefined>(
    localOrders.find((order) => order.orderId === route.params.orderId)
  );

  return (
    <ScreenContainer>
      {!!selectedOrder ? (
        <View>
          <ScreenHeader>
            <View>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <MaterialIcons
                  color={GRAY_600}
                  name="chevron-left"
                  size={34}
                  style={{ marginLeft: -12 }}
                />
                <Text
                  style={{ color: GRAY_600, fontSize: APP_FONT_SIZE * 1.5 }}
                >
                  Order Details
                </Text>
              </Pressable>
            </View>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: APP_PADDING,
              }}
            >
              <View>
                <Text
                  style={{
                    color: GRAY_600,
                    fontSize: APP_FONT_SIZE,
                  }}
                >
                  12 Royal Oak Gardens,
                </Text>
                <Text
                  style={{
                    color: GRAY_600,
                    fontSize: APP_FONT_SIZE,
                  }}
                >
                  Carindale, QLD, 4152
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "white",
                  borderWidth: 2,
                  borderColor: !!selectedOrder.deliveryMethod
                    ? GRAY_600
                    : "red",
                  padding: APP_PADDING,
                }}
              >
                <Text
                  style={{
                    color: GRAY_600,
                    fontWeight: "500",
                  }}
                >
                  {selectedOrder.deliveryMethod || "Not Set"}
                </Text>
              </View>
            </View>
          </ScreenHeader>
          <View
            style={{
              alignItems: "flex-end",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: GRAY_600, fontSize: 24 }}>Items</Text>
            <Text
              style={{ color: GRAY_600, fontSize: 12 }}
            >{`${selectedOrder.orderItems.reduce(
              (acc, val) => acc + parseInt(val.quantity!),
              0
            )} items`}</Text>
          </View>
          <OrderItems selectedOrder={selectedOrder} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: APP_PADDING,
            }}
          >
            <View>
              <ButtonBase title="Add to Pick Queue" />
            </View>
            <View style={{ flexDirection: "row" }}>
              <ButtonBase marginRight title="Dispatch" />
              <ButtonBase title="Pick" />
            </View>
          </View>
        </View>
      ) : (
        <Text>Nothing here</Text>
      )}
    </ScreenContainer>
  );
};

const SCREEN_ELEMENTS_HEIGHT = {
  header: 35,
  addressContainer: 44,
  itemsHeader: 37,
  footer: 42,
};

const { height } = Dimensions.get("window");

type OrderItemsProps = { selectedOrder: OrderProps };

const OrderItems = ({
  selectedOrder,
}: OrderItemsProps & ComponentPropsWithoutRef<typeof View>) => {
  return (
    <ScrollView
      style={{
        marginTop: APP_PADDING,
        maxHeight:
          height -
          (SCREEN_ELEMENTS_HEIGHT.addressContainer +
            SCREEN_ELEMENTS_HEIGHT.header +
            SCREEN_ELEMENTS_HEIGHT.itemsHeader +
            SCREEN_ELEMENTS_HEIGHT.footer) -
          36 -
          8,
      }}
    >
      {selectedOrder.orderItems.map((orderItem, index) => {
        return (
          <View
            key={orderItem.id}
            style={{
              backgroundColor: "white",
              flexDirection: "row",
              marginBottom:
                index === selectedOrder.orderItems.length - 1 ? 0 : APP_PADDING,
              padding: APP_PADDING,
            }}
          >
            <Text style={{ width: 40 }}>{orderItem.quantity}</Text>
            <Text style={{ width: 70 }}>{orderItem.code}</Text>
            <ItemColorsElement colors={orderItem.colors || ""} />

            <Text style={{ width: 50 }}> {orderItem.size}</Text>
            <Text
              style={{
                flex: 1,
                textAlign: "right",
              }}
            >
              {orderItem.location?.split(" ")[0]}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";

import { ItemColorsElement } from "@components/ItemColorsElement/ItemColorsElement";
import { ScreenContainer } from "@components/ScreenContainer";
import { ScreenHeader } from "@components/ScreenHeader";
import { TextInputBase } from "@components/TextInput/TextInputBase";
import { useAppDispatch, useAppSelector } from "@hooks";
import { clearPickQueue, clearPickedItems, setLocalOrders } from "@store";
import {
  APP_FONT_SIZE,
  APP_PADDING,
  GRAY_100,
  GRAY_200,
  GRAY_400,
  GRAY_600,
} from "@theme";
import { OrderProps, OrdersScreenRootProps } from "@types";
import { getLocalOrders } from "@utils";

type Nav = Pick<OrdersScreenRootProps, "navigation">["navigation"];

const { height } = Dimensions.get("window");

export const OrdersScreenRoot = ({ navigation }: OrdersScreenRootProps) => {
  const [screenElementsHeights] = useState({
    header: 35,
    searchBox: 44,
  });

  const dispatch = useAppDispatch();

  const { pickQueue } = useAppSelector(({ orders }) => orders);

  const handleLoadLocalOrders = async () => {
    const localOrders = await getLocalOrders();

    dispatch(
      setLocalOrders(
        localOrders.map((localOrder) => ({
          ...localOrder,
          orderItems: localOrder.orderItems.map((orderItem) => ({
            ...orderItem,
            code: orderItem.code?.toUpperCase(),
            location: orderItem.location?.toUpperCase(),
            size: /cm/gi.test(orderItem.size!)
              ? orderItem.size
              : orderItem.size?.toUpperCase(),
          })),
        }))
      )
    );
  };

  useEffect(() => {
    handleLoadLocalOrders();
  }, []);

  return (
    <ScreenContainer>
      <ScreenHeader>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
              style={{
                color: GRAY_600,
                fontSize: APP_FONT_SIZE * 1.5,
                fontWeight: "500",
              }}
            >
              All Orders
            </Text>
          </Pressable>
          <View style={{ flexDirection: "row" }}>
            <Pressable
              onPress={() => {
                navigation.navigate("NewOrderScreen");
              }}
            >
              <MaterialIcons
                color={GRAY_600}
                name="add-circle-outline"
                size={34.5}
                style={{ marginRight: APP_PADDING }}
              />
            </Pressable>
            <Pressable>
              <MaterialIcons
                color={!!pickQueue.length ? GRAY_600 : GRAY_200}
                name="store"
                onLongPress={() => {
                  dispatch(clearPickQueue());
                  dispatch(clearPickedItems());
                }}
                onPress={() => {
                  if (!!pickQueue.length) {
                    navigation.navigate("PickOrdersScreen", { source: "root" });
                  }
                }}
                size={34.5}
              />
            </Pressable>
          </View>
        </View>
      </ScreenHeader>
      <TextInputBase placeholder="Search" style={{ elevation: 2, zIndex: 1 }} />
      <ScrollView
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        style={{
          borderWidth: 0,
          height:
            height -
            (screenElementsHeights.header + screenElementsHeights.searchBox) -
            16 -
            8,
        }}
      >
        {["Pending", "Completed", "Dispatched"].map((item) => (
          <OrderStateCategoryToggle
            key={item}
            onChildPress={(orderId) => {
              console.log(orderId);
            }}
            onChildLongPress={(orderId) => {
              console.log(orderId);
            }}
            nav={navigation}
            title={item}
          />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

type OrderStateCategoryToggleProps = {
  onChildPress: (orderId: string) => void;
  onChildLongPress: (orderId: string) => void;
  nav: Nav;
  title: string;
};

const OrderStateCategoryToggle = ({
  onChildPress,
  onChildLongPress,
  nav,
  title,
  ...props
}: OrderStateCategoryToggleProps &
  ComponentPropsWithoutRef<typeof Pressable>) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(title === "Pending");

  const { localOrders, pickQueue } = useAppSelector(({ orders }) => orders);

  const [isLength, setIsLength] = useState<boolean>(
    !!localOrders.filter((order) => order.orderStatus === title.toLowerCase())
      .length
  );

  useEffect(() => {
    setIsLength(
      () =>
        !!localOrders.filter(
          (order) => order.orderStatus === title.toLowerCase()
        ).length
    );
  }, [localOrders]);

  return (
    <Pressable
      {...props}
      onPress={() => {
        setIsExpanded((isExpanded) => !isExpanded);
      }}
      style={{ marginTop: APP_PADDING }}
    >
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <Text style={{ color: GRAY_600, fontSize: APP_FONT_SIZE * 1.5 }}>
            {title}
          </Text>
          <MaterialIcons
            color={GRAY_600}
            name={`expand-${isExpanded ? "less" : "more"}`}
            size={24}
          />
        </View>
        <View
          style={{
            alignItems: "center",
            borderRadius: 100,
            borderWidth: 2,
            borderColor: isLength ? GRAY_600 : GRAY_100,
            height: 25,
            justifyContent: "center",
            width: 25,
          }}
        >
          <Text style={{ color: GRAY_600, fontWeight: "500" }}>
            {localOrders.filter(
              (order) => order.orderStatus === title.toLowerCase()
            ).length || ""}
          </Text>
        </View>
      </View>
      {localOrders
        .filter((order) => order.orderStatus === title.toLowerCase())
        .map((order) => (
          <OrderCard
            inQueue={pickQueue.includes(order.orderId)}
            isExpanded={isExpanded}
            key={order.orderId}
            onChildPress={(id) => {
              nav.navigate("OrderDetailsScreen", { orderId: id });
            }}
            onChildLongPress={(id) => {
              nav.navigate("EditOrderScreen", { action: "edit", orderId: id });
            }}
            orderDetails={order}
          />
        ))}
    </Pressable>
  );
};

type OrderCardProps = {
  inQueue: boolean;
  isExpanded: boolean;
  onChildPress: (id: string) => void;
  onChildLongPress: (id: string) => void;
  orderDetails: OrderProps;
};

export const OrderCard = ({
  inQueue,
  isExpanded,
  onChildPress,
  onChildLongPress,
  orderDetails,
  ...props
}: OrderCardProps & ComponentPropsWithoutRef<typeof Pressable>) => {
  const { pickedItems } = useAppSelector(({ orders }) => orders);

  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    setIsComplete(() =>
      orderDetails.orderItems
        .map((item) => item.id)
        .every((item) => pickedItems.map((item) => item.id).includes(item))
    );
  }, [pickedItems]);

  return (
    <View>
      {isExpanded ? (
        <Pressable
          {...props}
          onPress={() => onChildPress(orderDetails.orderId)}
          onLongPress={() => {
            onChildLongPress(orderDetails.orderId);
          }}
          delayLongPress={370 / 1.25}
          style={({ pressed }) => ({
            backgroundColor: "white",
            borderColor: pressed
              ? GRAY_200
              : isComplete
              ? "green"
              : inQueue
              ? GRAY_400
              : "white",
            borderWidth: 2,
            marginTop: APP_PADDING,
            padding: APP_PADDING - 2,
          })}
        >
          <View>
            <View
              style={{
                alignItems: "flex-start",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: GRAY_600,
                  fontSize: APP_FONT_SIZE,
                  marginBottom: APP_PADDING,
                }}
              >
                {orderDetails.deliveryMethod || ""}
              </Text>
              <Text style={{ color: GRAY_400, fontSize: 12 }}>
                {orderDetails.orderItems.reduce((acc, val) => {
                  return acc + parseInt(val.quantity!);
                }, 0)}{" "}
                items
              </Text>
            </View>
            {orderDetails.orderItems.map((orderItem) => (
              <View
                key={orderItem.id}
                style={{ alignItems: "center", flexDirection: "row" }}
              >
                <Text style={{ width: 40 }}>{orderItem.quantity}</Text>
                <Text style={{ width: 70 }}>{orderItem.code}</Text>
                <ItemColorsElement colors={orderItem.colors || ""} />
                <Text style={{ width: 50 }}> {orderItem.size}</Text>
                {pickedItems.map((item) => item.id).includes(orderItem.id) && (
                  <MaterialIcons color="green" name="check" size={15} />
                )}
                <Text
                  style={{
                    flex: 1,
                    textAlign: "right",
                  }}
                >
                  {orderItem.location?.split(" ")[0].toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </Pressable>
      ) : (
        <View></View>
      )}
    </View>
  );
};

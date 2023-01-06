import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ComponentPropsWithoutRef, useState } from "react";
import {
  DevSettings,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { ItemColorsElement } from "@components/ItemColorsElement/ItemColorsElement";
import { ScreenContainer } from "@components/ScreenContainer";
import { ScreenHeader } from "@components/ScreenHeader/ScreenHeader";
import { useAppDispatch, useAppSelector } from "@hooks";
import { addPickedItem, removePickedItem } from "@store";
import { APP_FONT_SIZE, APP_PADDING, GRAY_600 } from "@theme";
import { PickOrdersScreenRootProps, OrderItemProps } from "@types";

const { height } = Dimensions.get("window");

const SCREEN_ELEMENTS_HEIGHT = {
  header: 35,
};

type Nav = Pick<PickOrdersScreenRootProps, "navigation">["navigation"];

export const PickOrdersScreen = ({
  navigation,
  route: {
    params: { source },
  },
}: PickOrdersScreenRootProps) => {
  const dispatch = useAppDispatch();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { localOrders, pickedItems, pickQueue, priorityPickOrder } =
    useAppSelector(({ orders }) => orders);

  const [itemsToPick] = useState<OrderItemProps[]>(() => {
    if (source === "root") {
      return localOrders
        .filter((order) => pickQueue.includes(order.orderId))
        .reduce((acc, val) => {
          const sss = val.orderItems;
          return [...acc, ...sss];
        }, [] as OrderItemProps[]);
    }

    if (!source && !!priorityPickOrder) {
      return localOrders.find((order) => order.orderId === priorityPickOrder)
        ?.orderItems!;
    }

    return [];
  });

  return (
    <ScreenContainer>
      <ScreenHeader>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            alignSelf: "flex-start",
            flexDirection: "row",
          }}
        >
          <MaterialIcons
            color={GRAY_600}
            name="chevron-left"
            size={34}
            style={{ marginLeft: -12 }}
          />
          {/* {!!(itemsToPick.length - pickedItems.length) ? (
            <Text style={{ color: GRAY_600, fontSize: APP_FONT_SIZE * 1.5 }}>
              {itemsToPick.length - pickedItems.length} (
              {itemsToPick.reduce(
                (acc, val) => acc + parseInt(val.quantity!),
                0
              ) -
                pickedItems.reduce(
                  (acc, val) => acc + parseInt(val.quantity!),
                  0
                )}
              ) items
            </Text>
          ) : (
            <Text style={{ color: "green", fontSize: APP_FONT_SIZE * 1.5 }}>
              All items picked
            </Text>
          )} */}
          <Text
            style={{
              color: GRAY_600,
              fontSize: APP_FONT_SIZE * 1.5,
              fontWeight: "500",
            }}
          >
            Pick Queue
          </Text>
        </Pressable>
      </ScreenHeader>
      <ScrollView
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: height - SCREEN_ELEMENTS_HEIGHT.header - 24 }}
      >
        {sortItems(
          itemsToPick.filter(
            (item) => !pickedItems.map((item) => item.id).includes(item.id)
          )
        ).map((item, index) => (
          <PickItemComponent
            isLast={index === itemsToPick.length - 1}
            item={item}
            key={item.id}
            picked={pickedItems.map((item) => item.id).includes(item.id)}
          />
        ))}
        {!!pickedItems.length && (
          <Pressable
            onPress={() => {
              setIsExpanded((isExpanded) => !isExpanded);
            }}
            style={{
              alignItems: "center",
              marginBottom: APP_PADDING,
              flexDirection: "row",
            }}
          >
            <Text style={{ color: GRAY_600, fontSize: APP_FONT_SIZE * 1.5 }}>
              Picked
            </Text>
            <MaterialIcons
              color={GRAY_600}
              name={`expand-${isExpanded ? "less" : "more"}`}
              size={24}
            />
          </Pressable>
        )}
        {!!isExpanded &&
          pickedItems.map((item, index) => (
            <PickItemComponent
              isLast={index === itemsToPick.length - 1}
              item={item}
              key={item.id}
              picked={pickedItems.map((item) => item.id).includes(item.id)}
            />
          ))}
      </ScrollView>
    </ScreenContainer>
  );
};

type PickItemProps = { isLast: boolean; item: OrderItemProps; picked: boolean };

const PickItemComponent = ({
  isLast,
  item,
  picked,
  ...props
}: PickItemProps & ComponentPropsWithoutRef<typeof View>) => {
  const dispatch = useAppDispatch();

  return (
    <View
      {...props}
      style={{
        alignItems: "center",
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: isLast ? 0 : APP_PADDING,
        padding: APP_PADDING,
      }}
    >
      <Pressable
        onPress={() => {
          console.log("pressed the actual item");
        }}
        style={{
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            color: GRAY_600,
            textDecorationLine: picked ? "line-through" : "none",
            width: 40,
          }}
        >
          {item.quantity}
        </Text>
        <Text
          style={{
            color: GRAY_600,
            textDecorationLine: picked ? "line-through" : "none",
            width: 60,
          }}
        >
          {item.code}
        </Text>
        <ItemColorsElement colors={item.colors || ""} />
        <Text
          style={{
            color: GRAY_600,
            textDecorationLine: picked ? "line-through" : "none",
            width: 60,
          }}
        >
          {item.size}
        </Text>
        <Text
          style={{
            color: GRAY_600,
            textDecorationLine: picked ? "line-through" : "none",
          }}
        >
          {item.location?.split(" ")[0]}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          dispatch(picked ? removePickedItem(item) : addPickedItem(item));
        }}
        style={{
          alignItems: "center",
          borderColor: GRAY_600,
          borderWidth: 2,
          height: 25,
          justifyContent: "center",
          width: 25,
        }}
      >
        {picked && <MaterialIcons color={GRAY_600} name="close" size={20} />}
      </Pressable>
    </View>
  );
};

const sortItems = (items: OrderItemProps[]) => {
  const mappedLocations = items.map((item) => ({
    ...item,
    location: item.location?.split(" ")[0]!,
  }));

  const W2L1 = mappedLocations
    .filter((item) => /^21/gi.test(item.location?.split(" ")[0]!))
    .sort((a, b) => a.location?.localeCompare(b.location));
  const W2L2 = mappedLocations
    .filter((item) => /^22/gi.test(item.location?.split(" ")[0]!))
    .sort((a, b) => a.location?.localeCompare(b.location));
  const W2G = mappedLocations
    .filter((item) => /^2G/gi.test(item.location?.split(" ")[0]!))
    .sort((a, b) => a.location?.localeCompare(b.location));

  const W1L1 = mappedLocations
    .filter((item) => /^11/gi.test(item.location?.split(" ")[0]!))
    .sort((a, b) => a.location?.localeCompare(b.location));
  const W1L2 = mappedLocations
    .filter((item) => /^12/gi.test(item.location?.split(" ")[0]!))
    .sort((a, b) => a.location?.localeCompare(b.location));
  const W1G = mappedLocations
    .filter((item) => /^12/gi.test(item.location?.split(" ")[0]!))
    .sort((a, b) => a.location?.localeCompare(b.location));

  return [...W2L1, ...W2L2, ...W1L1, ...W1L2, ...W2G, ...W1G];
  // return items;
};

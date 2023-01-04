import AsyncStorage from "@react-native-async-storage/async-storage";
import UUID from "react-native-uuid";

import { OrderItemProps, OrderProps } from "@types";

export const addLocalOrder = async ({
  orderItems,
}: {
  orderItems: OrderItemProps[];
}) => {
  const existingLocalOrdersString = await AsyncStorage.getItem("localOrders");

  if (!!existingLocalOrdersString) {
    const localOrders = JSON.parse(existingLocalOrdersString) as OrderProps[];

    const newOrderId = UUID.v4() as string;

    const newLocalOrders: OrderProps[] = [
      ...localOrders,
      {
        deliveryMethod: undefined,
        orderId: newOrderId,
        orderItems,
        orderStatus: "pending",
      },
    ];

    await AsyncStorage.setItem("localOrders", JSON.stringify(newLocalOrders));

    return { newOrderId, allLocalStorageOrders: newLocalOrders };
  } else {
    const newOrderId = UUID.v4() as string;

    const newLocalOrders: OrderProps[] = [
      {
        deliveryMethod: undefined,
        orderId: newOrderId,
        orderItems,
        orderStatus: "pending",
      },
    ];

    await AsyncStorage.setItem("localOrders", JSON.stringify(newLocalOrders));

    return { newOrderId, allLocalStorageOrders: newLocalOrders };
  }
};

export const getLocalOrders = async () => {
  const existingLocalOrdersString = await AsyncStorage.getItem("localOrders");

  if (!!existingLocalOrdersString) {
    const localOrders = JSON.parse(existingLocalOrdersString) as OrderProps[];

    return localOrders;
  }

  return [];
};

export const updateLocalStorageOrders = async (updatedOrder: OrderProps) => {
  const localStorageOrdersString = await AsyncStorage.getItem("localOrders");

  if (!!localStorageOrdersString) {
    const localStorageOrders = JSON.parse(
      localStorageOrdersString
    ) as OrderProps[];

    const targetOrder = localStorageOrders.find(
      (order) => order.orderId === updatedOrder.orderId
    );

    const targetOrderIndex = localStorageOrders.indexOf(targetOrder!);

    const newLocalStorageOrders = [
      ...localStorageOrders.slice(0, targetOrderIndex),
      updatedOrder,
      ...localStorageOrders.slice(targetOrderIndex + 1),
    ];

    await AsyncStorage.setItem(
      "localOrders",
      JSON.stringify(newLocalStorageOrders)
    );

    return newLocalStorageOrders;
  }
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import UUID from "react-native-uuid";

import { OrderItemProps, OrderProps } from "@types";

export const updateLocalOrders = async ({
  orderItems,
}: {
  orderItems: OrderItemProps[];
}) => {
  console.log(orderItems);

  const existingLocalOrdersString = await AsyncStorage.getItem("localOrders");

  if (!!existingLocalOrdersString) {
    const localOrders = JSON.parse(existingLocalOrdersString) as OrderProps[];

    const newOrderId = UUID.v4() as string;

    const newLocalOrders: OrderProps[] = [
      ...localOrders,
      { orderId: newOrderId, orderItems },
    ];

    await AsyncStorage.setItem("localOrders", JSON.stringify(newLocalOrders));
  } else {
    const newOrderId = UUID.v4() as string;

    const newLocalOrders: OrderProps[] = [{ orderId: newOrderId, orderItems }];

    await AsyncStorage.setItem("localOrders", JSON.stringify(newLocalOrders));
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

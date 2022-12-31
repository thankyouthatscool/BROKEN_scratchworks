import { string } from "zod";

export * from "./forms";

export * from "./router";

export * from "./store";

export type OrderItemProps = {
  id: string;
  item: string | undefined;
  location: string | undefined;
  quantity: string | undefined;
};

export type OrderProps = {
  orderId: string;
  orderItems: OrderItemProps[];
};

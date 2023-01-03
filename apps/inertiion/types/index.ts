export * from "./forms";

export * from "./router";

export * from "./store";

export type OrderItemProps = {
  id: string;
  code: string | undefined;
  colors: string | undefined;
  item: string | undefined;
  location: string | undefined;
  quantity: string | undefined;
  size: string | undefined;
};

export type OrderProps = {
  deliveryMethod: string | undefined;
  orderId: string;
  orderItems: OrderItemProps[];
  orderStatus: "pending" | "completed" | "dispatched";
};

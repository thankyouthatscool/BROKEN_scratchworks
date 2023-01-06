import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import UUID from "react-native-uuid";

import { ButtonBase } from "@components/Button/ButtonBase";
import { ScreenContainer } from "@components/ScreenContainer";
import { ScreenHeader } from "@components/ScreenHeader/ScreenHeader";
import { TextBlockBase } from "@components/TextInput/TextBlockBase";
import { TextInputBase } from "@components/TextInput/TextInputBase";
import { useAppDispatch, useAppSelector } from "@hooks";
import { setLocalOrders } from "@store";
import { APP_FONT_SIZE, APP_PADDING, GRAY_600 } from "@theme";
import { EditOrderScreenRootProps, OrderItemProps, OrderProps } from "@types";
import { updateLocalStorageOrders } from "@utils";

export const EditOrderScreen = ({
  navigation,
  route: {
    params: { action, orderId },
  },
}: EditOrderScreenRootProps) => {
  const dispatch = useAppDispatch();

  const { localOrders } = useAppSelector(({ orders }) => orders);

  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [deliveryMethod, setDeliveryMethod] = useState<string | undefined>(
    undefined
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderProps | undefined>(
    localOrders.find((order) => order.orderId === orderId)
  );

  return (
    <ScreenContainer>
      <ScrollView>
        <ScreenHeader>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ alignItems: "center", flexDirection: "row" }}
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
              {action === "edit" ? "Edit Order" : "New Order"}
            </Text>
          </Pressable>
        </ScreenHeader>
        <TextBlockBase
          defaultValue={selectedOrder?.deliveryAddress}
          onChangeText={(deliveryAddressString) => {
            setDeliveryAddress(() => deliveryAddressString);
          }}
          placeholder="Delivery Address"
          style={{ elevation: 2, zIndex: 1 }}
        />
        <DeliveryMethodComponent
          defaultMethod={selectedOrder?.deliveryMethod}
          onUpdate={async (deliveryMethod) => {
            setDeliveryMethod(() => deliveryMethod);
          }}
        />
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: GRAY_600, fontSize: APP_FONT_SIZE * 1.5 }}>
            Items
          </Text>
          <Text style={{ color: GRAY_600 }}>
            {`${selectedOrder?.orderItems.reduce(
              (acc, val) => acc + parseInt(val.quantity!),
              0
            )} items`}
          </Text>
        </View>
        {!!selectedOrder &&
          selectedOrder.orderItems.map((orderItem) => {
            let itemCode: string[];
            let itemColors: string[];
            let itemSize: string[];

            if (!orderItem.code && !orderItem.colors && !orderItem.size) {
              const words = orderItem.item?.split(" ");

              itemCode = words?.filter((word) => /^[AH|G|IV]/gi.test(word))!;
              itemSize = words?.filter(
                (word) =>
                  ["s/m", "l/xl"].includes(word.toLowerCase()) ||
                  /\d{1,2}cm/gi.test(word)
              )!;
              itemColors = words
                ?.filter(
                  (word) => !["s/m", "l/xl"].includes(word.toLowerCase())
                )
                .filter((word) => !/\d{1,2}cm/gi.test(word))
                .filter((word) => !/^[AH|G|IV]/gi.test(word))
                .join(" ")
                .split("/")!;
            } else {
              itemCode = [];
              itemColors = [];
              itemSize = [];
            }

            return (
              <OrderItemForm
                key={orderItem.id}
                formData={{
                  code: orderItem.code! || itemCode.join(""),
                  colors: orderItem.colors! || itemColors.join(", "),
                  item: orderItem.item!,
                  itemId: orderItem.id,
                  location: orderItem.location!,
                  quantity: orderItem.quantity!,
                  size: orderItem.size! || itemSize.join(""),
                }}
                onOrderItemDelete={() => {
                  setSelectedOrder((selectedOrder) => {
                    const selectedOrderItem = selectedOrder?.orderItems.find(
                      (item) => item.id === orderItem.id
                    )!;

                    const selectedOrderItemIndex =
                      selectedOrder?.orderItems.indexOf(selectedOrderItem);

                    const newSelectedOrderItems =
                      selectedOrder?.orderItems.filter(
                        (_, index) => index !== selectedOrderItemIndex
                      )!;

                    return {
                      ...selectedOrder!,
                      orderItems: newSelectedOrderItems,
                    };
                  });
                }}
                onUpdate={(formData) => {
                  setSelectedOrder((selectedOrder) => {
                    const updateOrderItem = selectedOrder?.orderItems.find(
                      (order) => order.id === formData.itemId
                    );

                    const updatedOderItemIndex =
                      selectedOrder?.orderItems.indexOf(updateOrderItem!);

                    return {
                      ...selectedOrder!,
                      deliveryMethod,
                      orderItems: [
                        ...selectedOrder?.orderItems.slice(
                          0,
                          updatedOderItemIndex
                        )!,
                        { ...formData, id: formData.itemId },
                        ...selectedOrder?.orderItems.slice(
                          updatedOderItemIndex! + 1
                        )!,
                      ],
                    };
                  });
                }}
              />
            );
          })}
        <Footer
          onAdd={() => {
            const newItemId = UUID.v4() as string;

            setSelectedOrder((selectedOrder) => {
              return {
                ...selectedOrder!,
                orderItems: [
                  ...selectedOrder?.orderItems!,
                  {
                    code: "",
                    colors: "",
                    id: newItemId,
                    item: "",
                    location: "",
                    quantity: "",
                    size: "",
                  },
                ],
              };
            });
          }}
          onAddDisabled={
            !!selectedOrder?.orderItems.some(
              (item) => !item.quantity || !item.code || !item.location
            )
          }
          onCancel={() => {
            navigation.goBack();
          }}
          onSave={async () => {
            const updatedLocalStorageOrders = await updateLocalStorageOrders({
              ...selectedOrder!,
              deliveryAddress,
              deliveryMethod,
            });

            dispatch(setLocalOrders(updatedLocalStorageOrders!));

            navigation.navigate("OrdersScreenRoot");
          }}
          onSaveDisabled={
            !!selectedOrder?.orderItems.some(
              (item) => !item.quantity || !item.code || !item.location
            )
          }
        />
      </ScrollView>
    </ScreenContainer>
  );
};

type FormData = {
  code: string;
  colors: string;
  item: string;
  itemId: string;
  location: string;
  quantity: string;
  size: string;
};

type OrderItemFormProps = {
  formData: FormData;
  onOrderItemDelete: () => void;
  onUpdate: (formData: FormData) => void;
};

const OrderItemForm = ({
  formData: { code, colors, item, itemId, location, quantity, size },
  onOrderItemDelete,
  onUpdate,
}: OrderItemFormProps) => {
  const [formData, setFormData] = useState({
    code,
    colors,
    item,
    itemId,
    location,
    quantity,
    size,
  });

  useEffect(() => {
    onUpdate(formData);
  }, [formData]);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          marginTop: APP_PADDING,
          marginBottom: APP_PADDING,
        }}
      >
        <TextInputBase
          defaultValue={formData.quantity}
          keyboardType="number-pad"
          onChangeText={(e) => {
            setFormData((formData) => ({ ...formData, quantity: e }));
          }}
          placeholder="Qty"
          style={{ marginRight: APP_PADDING, width: 50 }}
        />
        <TextInputBase
          defaultValue={formData.code}
          onChangeText={(e) => {
            setFormData((formData) => ({ ...formData, code: e }));
          }}
          placeholder="Item Code"
          style={{ flex: 1, marginRight: APP_PADDING }}
        />
        <TextInputBase
          defaultValue={formData.size}
          onChangeText={(e) => {
            setFormData((formData) => ({ ...formData, size: e }));
          }}
          placeholder="Size"
          style={{ width: 80 }}
        />
      </View>
      <View style={{ flexDirection: "row" }}>
        <TextInputBase
          defaultValue={formData.colors.toLowerCase()}
          onChangeText={(e) => {
            setFormData((formData) => ({ ...formData, colors: e }));
          }}
          placeholder="Color"
          style={{ flex: 1, marginRight: APP_PADDING }}
        />
        <TextInputBase
          defaultValue={formData.location.split(" ")[0]}
          onChangeText={(e) =>
            setFormData((formData) => ({ ...formData, location: e }))
          }
          placeholder="Location"
          style={{ width: 80, marginRight: APP_PADDING }}
        />
        <ButtonBase
          icon="delete"
          onPress={onOrderItemDelete}
          style={{ width: 80 }}
          title="Delete"
          type="danger"
        />
      </View>
    </View>
  );
};

const DELIVERY_METHODS = [
  "Air Bag",
  "Couriers Please",
  "First Express",
  "Toll",
];

type DeliveryMethodComponentProps = {
  defaultMethod: string | undefined;
  onUpdate: (deliveryMethod: string) => void;
};

const DeliveryMethodComponent = ({
  defaultMethod,
  onUpdate,
}: DeliveryMethodComponentProps) => {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<
    string | undefined
  >(defaultMethod);

  useEffect(() => {
    if (!!selectedDeliveryMethod) {
      onUpdate(selectedDeliveryMethod);
    }
  }, [defaultMethod, selectedDeliveryMethod]);

  return (
    <ScrollView
      contentContainerStyle={{
        marginTop: APP_PADDING,
        marginBottom: APP_PADDING,
      }}
      horizontal={true}
      overScrollMode="never"
    >
      {DELIVERY_METHODS.map((deliveryMethod, index) => {
        return (
          <Pressable
            key={deliveryMethod}
            onPress={() => {
              setSelectedDeliveryMethod(() => deliveryMethod);
            }}
            style={{
              backgroundColor: "white",
              borderWidth: 2,
              borderColor:
                selectedDeliveryMethod === deliveryMethod ? GRAY_600 : "white",
              padding: APP_PADDING,
              marginRight:
                index === DELIVERY_METHODS.length - 1 ? 0 : APP_PADDING,
            }}
          >
            <Text style={{ color: GRAY_600, fontWeight: "500" }}>
              {deliveryMethod}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

type FooterProps = {
  onAdd: () => void;
  onAddDisabled: boolean;
  onCancel: () => void;
  onSave: () => void;
  onSaveDisabled: boolean;
};

const Footer = ({
  onAdd,
  onAddDisabled,
  onCancel,
  onSave,
  onSaveDisabled,
}: FooterProps) => {
  return (
    <View style={{ marginTop: APP_PADDING }}>
      <ButtonBase
        disabled={onAddDisabled}
        onPress={onAdd}
        style={{ alignSelf: "flex-start" }}
        title="Add"
        type="secondary"
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: APP_PADDING,
        }}
      >
        <ButtonBase
          marginRight
          onPress={onCancel}
          title="Cancel"
          type="secondary"
        />
        <ButtonBase disabled={onSaveDisabled} onPress={onSave} title="Save" />
      </View>
    </View>
  );
};

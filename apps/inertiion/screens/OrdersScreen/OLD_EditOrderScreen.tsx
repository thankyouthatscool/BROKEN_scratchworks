import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ButtonBase } from "@components/Button/ButtonBase";
import { ScreenContainer } from "@components/ScreenContainer";
import { TextBlockBase } from "@components/TextInput/TextBlockBase";
import { TextInputBase } from "@components/TextInput/TextInputBase";
import { useAppDispatch, useAppSelector } from "@hooks";
import { setLocalOrders } from "@store";
import { APP_FONT_SIZE, APP_PADDING, GRAY_600 } from "@theme";
import { EditOrderScreenRootProps, OrderProps } from "@types";
import { updateLocalStorageOrders } from "@utils";

export const EditOrderScreen = ({
  navigation,
  route: {
    params: { orderId },
  },
}: EditOrderScreenRootProps) => {
  const { localOrders } = useAppSelector(({ orders }) => orders);

  const [selectedOrder, setSelectedOrder] = useState<OrderProps | undefined>(
    localOrders.find((order) => order.orderId === orderId)
  );

  const [deliveryMethod, setDeliveryMethod] = useState<string | undefined>(
    undefined
  );

  const dispatch = useAppDispatch();

  const updateSelectedOrder = (
    data: {
      id: string;
      code: string;
      colors: string;
      item: string;
      quantity: string;
      location: string;
      size: string;
    },
    del: string | undefined
  ) => {
    setSelectedOrder((selectedOrder) => {
      const updateOrderItem = selectedOrder?.orderItems.find(
        (order) => order.id === data.id
      );

      const updatedOderItemIndex = selectedOrder?.orderItems.indexOf(
        updateOrderItem!
      );

      return {
        ...selectedOrder!,
        orderItems: [
          ...selectedOrder?.orderItems.slice(0, updatedOderItemIndex)!,
          { ...data, deliveryMethod: del },
          ...selectedOrder?.orderItems.slice(updatedOderItemIndex! + 1)!,
        ],
      };
    });
  };

  return (
    <ScreenContainer>
      <ScrollView>
        <TextBlockBase placeholder="Order Address" />
        <DeliveryMethodComponent
          initialMethod={selectedOrder?.deliveryMethod}
          onUpdate={(method) => setDeliveryMethod(() => method)}
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
            const words = orderItem.item?.split(" ");

            const itemCode = words?.filter((word) =>
              /^[AH|B|G|IV|STS]/gi.test(word)
            );
            const itemSize = words?.filter(
              (word) =>
                ["s/m", "l/xl"].includes(word.toLowerCase()) ||
                /\d{1,2}cm/gi.test(word)
            );

            const itemColors = words
              ?.filter((word) => !["s/m", "l/xl"].includes(word.toLowerCase()))
              .filter((word) => !/\d{1,2}cm/gi.test(word))
              .filter((word) => !/^[AH|B|G|IV|STS]/gi.test(word))
              .join(" ")
              .split("/");

            return (
              <OrderItemForm
                code={itemCode?.join("")!}
                colors={itemColors?.join(", ")!}
                item={orderItem.item!}
                itemId={orderItem.id}
                key={orderItem.id}
                location={orderItem.location!}
                quantity={orderItem.quantity!}
                size={itemSize?.join("")!}
                onFormUpdate={(data) => {
                  if (!!data) {
                    updateSelectedOrder(data, deliveryMethod);
                  }
                }}
              />
            );
          })}
        <Footer
          onCancel={() => {
            navigation.goBack();
          }}
          onSave={async () => {
            const updatedLocalStorageOrders = await updateLocalStorageOrders({
              ...selectedOrder!,
              deliveryMethod,
            });

            dispatch(setLocalOrders(updatedLocalStorageOrders!));

            navigation.navigate("OrdersScreenRoot");
          }}
        />
      </ScrollView>
    </ScreenContainer>
  );
};

type OrderItemFormProps = {
  code: string;
  colors: string;
  item: string;
  itemId: string;
  location: string;
  quantity: string;
  size: string;

  onFormUpdate: (formData: {
    id: string;
    code: string;
    colors: string;
    item: string;
    location: string;
    quantity: string;
    size: string;
  }) => void;
};

const OrderItemForm = ({
  code,
  colors,
  item,
  itemId,
  quantity,
  location,
  size,
  onFormUpdate,
}: OrderItemFormProps) => {
  const [formData, setFormData] = useState<{
    // FIXME: These types are repeated all over the place.
    id: string;
    code: string;
    colors: string;
    item: string;
    location: string;
    quantity: string;
    size: string;
  }>({ id: itemId, code, colors, item, location, quantity, size });

  useEffect(() => {
    onFormUpdate(formData);
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
            setFormData((formData) => ({ ...formData, item: e }));
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
          onPress={() => {
            console.log(`Will delete ${itemId}`);
          }}
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
  initialMethod: string | undefined;
  onUpdate: (method: string) => void;
};

const DeliveryMethodComponent = ({
  initialMethod,
  onUpdate,
}: DeliveryMethodComponentProps) => {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState<string>("");

  useEffect(() => {
    onUpdate(selectedDeliveryMethod);
  }, [selectedDeliveryMethod]);

  useEffect(() => {
    setSelectedDeliveryMethod(() => (!!initialMethod ? initialMethod : ""));
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        marginTop: APP_PADDING,
        marginBottom: APP_PADDING,
      }}
      horizontal={true}
      overScrollMode="never"
    >
      {DELIVERY_METHODS.map((item, index) => (
        <Pressable
          key={item}
          onPress={() => {
            setSelectedDeliveryMethod(() => item);
          }}
          style={{
            backgroundColor: "white",
            borderWidth: 2,
            borderColor: selectedDeliveryMethod === item ? GRAY_600 : "white",
            padding: APP_PADDING,
            marginRight:
              index === DELIVERY_METHODS.length - 1 ? 0 : APP_PADDING,
          }}
        >
          <Text style={{ color: GRAY_600, fontWeight: "500" }}>{item}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

type FooterProps = { onCancel: () => void; onSave: () => void };

const Footer = ({ onCancel, onSave }: FooterProps) => {
  return (
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
      <ButtonBase onPress={onSave} title="Save" />
    </View>
  );
};

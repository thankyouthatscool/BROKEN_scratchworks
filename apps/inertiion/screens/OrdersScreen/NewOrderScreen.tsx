import axios from "axios";
import { Buffer } from "buffer";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Button, Pressable, ScrollView, Text, View } from "react-native";
import UUID from "react-native-uuid";

import { ButtonBase } from "@components/Button/ButtonBase";
import { ScreenContainer } from "@components/ScreenContainer";
import { ScreenHeader } from "@components/ScreenHeader";
import { TextBlockBase } from "@components/TextInput/TextBlockBase";
import { TextInputBase } from "@components/TextInput/TextInputBase";
import { useAppDispatch, useToast } from "@hooks";
import { setLocalOrders } from "@store";
import { NewOrderScreenRootProps } from "@types";
import { addLocalOrder, trpc } from "@utils";
import { APP_FONT_SIZE, APP_PADDING, GRAY_600 } from "@theme";

export const NewOrderScreen = ({ navigation }: NewOrderScreenRootProps) => {
  const [currentStep, setCurrentStep] = useState<
    "pickOrderSource" | "verifyOrderDetails"
  >("pickOrderSource");

  const { showToast } = useToast();

  const dispatch = useAppDispatch();

  const { mutateAsync: uploadOrderImageMutateAsync } =
    trpc.inertiion.order.uploadOrderImage.useMutation();

  const { mutateAsync: analyzeOrderImageMutateAsync } =
    trpc.inertiion.order.analyzeOrderImage.useMutation();

  const handleAdd = async (imageSource: "camera" | "gallery") => {
    try {
      let imagePickerRes: ImagePicker.ImagePickerResult;

      const imagePickerOptions = {
        allowsEditing: false,
        allowsMultipleSelection: false,
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.3,
      };

      if (imageSource === "camera") {
        imagePickerRes = await ImagePicker.launchCameraAsync(
          imagePickerOptions
        );
      } else {
        imagePickerRes = await ImagePicker.launchImageLibraryAsync(
          imagePickerOptions
        );
      }

      if (!imagePickerRes.canceled) {
        const imageName = UUID.v4() as string;

        const base64Representation = imagePickerRes.assets[0].base64!;

        const uploadUrl = await uploadOrderImageMutateAsync({ imageName });

        showToast({ message: "Uploading image..." });

        await axios.put(uploadUrl, Buffer.from(base64Representation, "base64"));

        showToast({
          message: "Extracting order details...",
          options: { duration: "long" },
        });

        const blocks = await analyzeOrderImageMutateAsync({ imageName });

        const lineBlocks = blocks.filter((block) => block.BlockType === "LINE");

        const itemLineBlocks = lineBlocks.filter((line) => {
          if (line.Text) {
            return /^[AH|G|IV]{1,2}\d{1,4}\s/gi.test(line.Text);
          } else {
            return false;
          }
        });

        const res = itemLineBlocks.map((itemBlock) => {
          const targetBlockIndex = lineBlocks.indexOf(
            lineBlocks.find((block) => block.Id === itemBlock.Id)!
          );

          const quantity = lineBlocks[targetBlockIndex - 1].Text;
          const location = lineBlocks[targetBlockIndex + 1].Text;

          return {
            id: UUID.v4() as string,
            code: undefined,
            colors: undefined,
            item: itemBlock.Text,
            location,
            quantity,
            size: undefined,
          };
        });

        const { allLocalStorageOrders, newOrderId } = await addLocalOrder({
          orderItems: res,
        });

        dispatch(setLocalOrders(allLocalStorageOrders));

        showToast({ message: "Saved! 👍" });

        navigation.navigate("EditOrderScreen", {
          action: "create",
          orderId: newOrderId,
        });
      } else {
        throw new Error("No image was picked.");
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({ message: err.message });
      } else {
        showToast({ message: "GENERIC_ERROR_MESSAGE" });
      }
    }
  };

  return (
    <ScreenContainer>
      {currentStep === "pickOrderSource" && (
        <View>
          <ScreenHeader>
            <Button
              onPress={() => {
                navigation.goBack();
              }}
              title="back"
            />
          </ScreenHeader>
          <View style={{ alignItems: "flex-start" }}>
            <ButtonBase
              marginBottom
              onPress={() => {
                handleAdd("gallery");
              }}
              title="Add from Gallery"
            />
            <ButtonBase
              onPress={() => {
                handleAdd("camera");
              }}
              title="Add from Camera"
            />
          </View>
        </View>
      )}
      {currentStep === "verifyOrderDetails" && (
        <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false}>
          <View>
            <ScreenHeader>
              <Button
                onPress={() => {
                  navigation.goBack();
                }}
                title="back"
              />
            </ScreenHeader>
            <TextBlockBase placeholder="Order Address" />
            <DeliveryMethodComponent />
            <View
              style={{
                alignItems: "flex-end",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: APP_PADDING,
              }}
            >
              <Text
                style={{
                  color: GRAY_600,
                  fontSize: APP_FONT_SIZE * 1.5,
                }}
              >
                Order Items
              </Text>
              <Text
                style={{
                  color: GRAY_600,
                  fontSize: APP_FONT_SIZE * 0.75,
                }}
              >
                42 items 2.5kg
              </Text>
            </View>
            <OrderItemForm />
          </View>
          <View>
            <Text>Footer</Text>
          </View>
        </ScrollView>
      )}
    </ScreenContainer>
  );
};

const DELIVERY_METHODS = [
  "Air Bag",
  "Couriers Please",
  "First Express",
  "Toll",
];

const DeliveryMethodComponent = () => {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState<string>("");

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

const OrderItemForm = () => {
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
          keyboardType="number-pad"
          placeholder="Qty"
          style={{ width: 50, marginRight: APP_PADDING }}
        />
        <TextInputBase
          placeholder="Item Code"
          style={{ flex: 1, marginRight: APP_PADDING }}
        />
        <TextInputBase placeholder="Size" style={{ width: 80 }} />
      </View>
      <View style={{ flexDirection: "row" }}>
        <TextInputBase
          placeholder="Color"
          style={{ flex: 1, marginRight: APP_PADDING }}
        />
        <TextInputBase
          placeholder="Location"
          style={{ width: 80, marginRight: APP_PADDING }}
        />
        <ButtonBase title="Delete" style={{ width: 80 }} type="danger" />
      </View>
    </View>
  );
};

import { Button, View } from "react-native";

import { ButtonBase } from "@components/Button/ButtonBase";
import { ScreenContainer } from "@components/ScreenContainer";
import { ScreenHeader } from "@components/ScreenHeader";
import { NewOrderScreenRootProps } from "@types";

export const NewOrderScreen = ({ navigation }: NewOrderScreenRootProps) => {
  const handleAdd = async (source: "camera" | "gallery") => {
    console.log(source);
  };

  return (
    <ScreenContainer>
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
    </ScreenContainer>
  );
};

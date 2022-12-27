import { useState } from "react";
import { View } from "react-native";

import WelcomeCatsImage from "@assets/welcome-cats.svg";
import { ButtonBase } from "@components/Button";
import { ErrorMessageText } from "@components/ErrorMessageText";
import { ScreenContainer } from "@components/ScreenContainer";
import { TextInputBase } from "@components/TextInput/TextInputBase";
import { APP_PADDING, AUTH_SCREEN_IMAGE_HEIGHT } from "@theme";
import type { SignUpScreenProps } from "@types";
import { lookupImageSize } from "@utils";

const { imageHeight, imageWidth } = lookupImageSize("welcomeCats");

export const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
  const [isPasswordConfirmationError, setIsPasswordConfirmationError] =
    useState<boolean>(false);

  return (
    <ScreenContainer>
      <View
        style={{
          alignItems: "center",
          marginBottom: APP_PADDING * 2,
        }}
      >
        <WelcomeCatsImage
          height={AUTH_SCREEN_IMAGE_HEIGHT}
          width={(imageWidth / imageHeight) * AUTH_SCREEN_IMAGE_HEIGHT}
        />
      </View>
      <TextInputBase
        placeholder="Email"
        style={{ marginBottom: isEmailError ? 0 : APP_PADDING }}
      />
      {isEmailError && <ErrorMessageText message="email required" />}
      <TextInputBase
        secureTextEntry
        placeholder="Password"
        style={{ marginBottom: isPasswordError ? 0 : APP_PADDING }}
      />
      {isPasswordError && <ErrorMessageText message="password required" />}
      <TextInputBase
        secureTextEntry
        placeholder="Confirm Password"
        style={{ marginBottom: isPasswordError ? 0 : APP_PADDING }}
      />
      {isPasswordConfirmationError && (
        <ErrorMessageText message="passwords must match" />
      )}
      <View
        style={{
          alignItems: "flex-start",
          flexDirection: "row",
          justifyContent: "flex-end",
          marginBottom: APP_PADDING,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <ButtonBase
            marginRight
            onPress={() => {
              navigation.goBack();
            }}
            title="Cancel"
            type="secondary"
          />
          <ButtonBase
            disabled={
              !!isEmailError ||
              !!isPasswordError ||
              !!isPasswordConfirmationError
            }
            onPress={() => {
              console.log("Signing Up...");
            }}
            title="Sign Up"
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

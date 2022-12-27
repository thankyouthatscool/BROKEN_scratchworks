import { useState } from "react";
import { View } from "react-native";

import SignInImage from "@assets/sign-in.svg";
import { ButtonBase } from "@components/Button/ButtonBase";
import { ErrorMessageText } from "@components/ErrorMessageText";
import { ScreenContainer } from "@components/ScreenContainer";
import { TextInputBase } from "@components/TextInput/TextInputBase";
import { APP_PADDING, AUTH_SCREEN_IMAGE_HEIGHT } from "@theme";
import { LoginScreenProps } from "@types";
import { lookupImageSize } from "@utils";

const { imageHeight, imageWidth } = lookupImageSize("signIn");

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [isPasswordError, setIsPasswordError] = useState<boolean>(false);

  return (
    <ScreenContainer>
      <View
        style={{
          alignItems: "center",
          marginBottom: APP_PADDING * 2,
        }}
      >
        <SignInImage
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
      <View
        style={{
          alignItems: "flex-start",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: APP_PADDING,
        }}
      >
        <View
          style={{
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <ButtonBase
            onPress={() => {
              navigation.navigate("ForgotPasswordScreen", {});
            }}
            title="Forgot Password"
            type="secondary"
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <ButtonBase
            marginRight
            onPress={() => {
              navigation.navigate("SignUpScreen", {});
            }}
            title="Sign Up"
          />
          <ButtonBase
            disabled={!!isEmailError || !!isPasswordError}
            onPress={() => {
              console.log("Logging In...");
            }}
            title="Login"
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

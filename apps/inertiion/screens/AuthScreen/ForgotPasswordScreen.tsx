import { useState } from "react";
import { View } from "react-native";

import ForgotPasswordImage from "@assets/forgot-password.svg";
import { ButtonBase } from "@components/Button";
import { ErrorMessageText } from "@components/ErrorMessageText";
import { ScreenContainer } from "@components/ScreenContainer";
import { TextInputBase } from "@components/TextInput";
import { APP_PADDING, AUTH_SCREEN_IMAGE_HEIGHT } from "@theme";
import { ForgotPasswordScreenProps } from "@types";
import { lookupImageSize } from "@utils";

const { imageHeight, imageWidth } = lookupImageSize("forgotPassword");

export const ForgotPasswordScreen = ({
  navigation,
}: ForgotPasswordScreenProps) => {
  const [currentStep, setCurrentStep] = useState<"code" | "email" | "password">(
    "email"
  );
  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [isCodeError, IsCodeError] = useState<boolean>(false);
  const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
  const [isConfirmPasswordError, setIsConfirmPasswordError] =
    useState<boolean>(false);

  return (
    <ScreenContainer>
      <View
        style={{
          alignItems: "center",
          marginBottom: APP_PADDING * 2,
        }}
      >
        <ForgotPasswordImage
          height={AUTH_SCREEN_IMAGE_HEIGHT}
          width={(imageWidth / imageHeight) * AUTH_SCREEN_IMAGE_HEIGHT}
        />
      </View>

      {/* Current Step: Email */}

      {currentStep === "email" && (
        <View>
          <TextInputBase
            placeholder="Email"
            style={{ marginBottom: isEmailError ? 0 : APP_PADDING }}
          />
          {isEmailError && <ErrorMessageText message="email required" />}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <View>
              <ButtonBase
                marginRight
                onPress={() => {
                  navigation.goBack();
                }}
                title="Cancel"
                type="secondary"
              />
            </View>
            <View>
              <ButtonBase
                disabled={!!isEmailError}
                onPress={() => {
                  console.log("Sending the code...");

                  console.log(
                    "This button will also be used for re-sending the code as well..."
                  );

                  setCurrentStep(() => "code");
                }}
                title="Send Code"
              />
            </View>
          </View>
        </View>
      )}

      {/* Current Step: Code */}

      {currentStep === "code" && (
        <View>
          <TextInputBase
            placeholder="Code"
            style={{ marginBottom: isCodeError ? 0 : APP_PADDING }}
          />
          {isCodeError && <ErrorMessageText message="code required" />}
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <ButtonBase
              marginRight
              onPress={() => {
                setCurrentStep(() => "email");
              }}
              title="Back"
              type="secondary"
            />
            <ButtonBase
              disabled={!!isCodeError}
              onPress={() => {
                console.log("Verifying the code...");

                setCurrentStep(() => "password");
              }}
              title="Verify Code"
            />
          </View>
        </View>
      )}

      {/* Current Step: Password */}

      {currentStep === "password" && (
        <View>
          <TextInputBase
            placeholder="Password"
            style={{ marginBottom: isPasswordError ? 0 : APP_PADDING }}
          />
          {isPasswordError && <ErrorMessageText message="password required" />}
          <TextInputBase
            placeholder="Confirm Password"
            style={{ marginBottom: isConfirmPasswordError ? 0 : APP_PADDING }}
          />
          {isConfirmPasswordError && (
            <ErrorMessageText message="passwords must match" />
          )}
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <ButtonBase
              marginRight
              onPress={() => {
                navigation.navigate("LoginScreen", {});
              }}
              title="Cancel"
              type="secondary"
            />
            <ButtonBase
              disabled={!!isPasswordError || !!isConfirmPasswordError}
              onPress={() => {
                console.log("Changing the password...");
              }}
              title="Set New Password"
            />
          </View>
        </View>
      )}
    </ScreenContainer>
  );
};

import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentPropsWithoutRef, useState } from "react";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";

import SignInImage from "@assets/sign-in.svg";
import { ButtonBase } from "@components/Button/ButtonBase";
import { ErrorMessageText } from "@components/ErrorMessageText";
import { ScreenContainer } from "@components/ScreenContainer";
import { TextInputBase } from "@components/TextInput/TextInputBase";
import { APP_PADDING, AUTH_SCREEN_IMAGE_HEIGHT } from "@theme";
import {
  LoginScreenProps,
  AuthTextInputProps,
  LogInFormProps,
  LogInFormTextInputProps,
} from "@types";
import { lookupImageSize } from "@utils";

const { imageHeight, imageWidth } = lookupImageSize("signIn");

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password is required - 8 chars min." }),
});

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const {
    clearErrors,
    control,
    formState: { errors },
    handleSubmit,
    reset,
    resetField,
  } = useForm<LogInFormProps>({
    mode: "onTouched",
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit: SubmitHandler<LogInFormProps> = async ({
    email,
    password,
  }) => {
    console.log(email);
    console.log(password);
  };

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
      <LoginFormTextInput
        control={control}
        keyboardType="email-address"
        name="email"
        placeholder="Email"
      />
      <LoginFormTextInput
        control={control}
        name="password"
        placeholder="Password"
        secure
      />
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
            disabled={!!errors["email"] || !!errors["password"]}
            onPress={handleSubmit(onSubmit)}
            title="Login"
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const LoginFormTextInput = ({
  additionalOnChange,
  control,
  defaultValue,
  name,
  secure,
  ...props
}: AuthTextInputProps &
  LogInFormTextInputProps &
  ComponentPropsWithoutRef<typeof TextInputBase>) => {
  const {
    field,
    formState: { errors },
  } = useController({ control, defaultValue, name });

  return (
    <View>
      <TextInputBase
        {...props}
        autoCapitalize="none"
        onBlur={field.onBlur}
        onChangeText={(text) => {
          field.onChange(text);

          if (!!additionalOnChange) {
            additionalOnChange(text);
          }
        }}
        secureTextEntry={!!secure}
        style={{ marginBottom: !!errors[name] ? 0 : APP_PADDING }}
        value={field.value}
      />
      {!!errors[name] && <ErrorMessageText message={errors[name]?.message!} />}
    </View>
  );
};

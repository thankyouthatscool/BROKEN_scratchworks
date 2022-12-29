import { zodResolver } from "@hookform/resolvers/zod";
import * as SecureStore from "expo-secure-store";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";

import SignInImage from "@assets/sign-in.svg";
import { ButtonBase } from "@components/Button/ButtonBase";
import { ErrorMessageText } from "@components/ErrorMessageText";
import { ScreenContainer } from "@components/ScreenContainer";
import { TextInputBase } from "@components/TextInput/TextInputBase";
import { useAppDispatch, useAppSelector, useToast } from "@hooks";
import { setLoading, setUser } from "@store";
import { APP_PADDING, AUTH_SCREEN_IMAGE_HEIGHT } from "@theme";
import {
  LoginScreenProps,
  AuthTextInputProps,
  LocalUser,
  LogInFormProps,
  LogInFormTextInputProps,
} from "@types";
import { lookupImageSize, trpc } from "@utils";

const { imageHeight, imageWidth } = lookupImageSize("signIn");

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password is required - 8 chars min." }),
});

export const LoginScreen = ({
  navigation,
  route: { params },
}: LoginScreenProps) => {
  const [emailAddressCopy, setEmailAddressCopy] = useState<string>("");

  const { showToast } = useToast();

  const dispatch = useAppDispatch();

  const { loading } = useAppSelector(({ app }) => app);

  const {
    clearErrors,
    control,
    formState: { errors },
    handleSubmit,
    reset,
    resetField,
    setValue,
  } = useForm<LogInFormProps>({
    mode: "onTouched",
    resolver: zodResolver(loginFormSchema),
  });

  const { mutateAsync: loginMutateAsync } =
    trpc.inertiion.auth.login.useMutation();

  const onSubmit: SubmitHandler<LogInFormProps> = async ({
    email,
    password,
  }) => {
    dispatch(setLoading(true));

    const res = await loginMutateAsync({ email, password });

    if (typeof res === "string") {
      showToast({ message: res });

      resetField("password");
    } else {
      const token = res.token;

      await SecureStore.setItemAsync("token", token);

      const userData = res.userData as LocalUser;

      dispatch(setUser({ email: userData.email, id: userData.id }));

      showToast({ message: "Successfully logged in!" });

      reset();
      clearErrors();

      navigation.navigate("HomeScreen");
    }

    dispatch(setLoading(false));
  };

  useEffect(() => {
    if (params?.email) {
      setValue("email", params.email);
    }
  }, [params]);

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
        additionalOnChange={(text) => {
          setEmailAddressCopy(() => text);
        }}
        control={control}
        editable={!loading}
        keyboardType="email-address"
        name="email"
        placeholder="Email"
      />
      <LoginFormTextInput
        control={control}
        editable={!loading}
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
            disabled={!!loading}
            onPress={() => {
              navigation.navigate("ForgotPasswordScreen", {
                email: emailAddressCopy || params?.email,
              });
            }}
            title="Forgot Password"
            type="secondary"
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <ButtonBase
            disabled={!!loading || !!errors["email"]}
            marginRight
            onPress={() => {
              navigation.navigate("SignUpScreen", {
                email: emailAddressCopy || params?.email,
              });

              resetField("password");
              clearErrors();
            }}
            title="Sign Up"
          />
          <ButtonBase
            disabled={!!loading || !!errors["email"] || !!errors["password"]}
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

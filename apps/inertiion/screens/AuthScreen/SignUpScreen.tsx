import { zodResolver } from "@hookform/resolvers/zod";
import * as SecureStore from "expo-secure-store";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";

import WelcomeAltImage from "@assets/welcome-alt.svg";
import { ButtonBase } from "@components/Button";
import { ErrorMessageText } from "@components/ErrorMessageText";
import { ScreenContainer } from "@components/ScreenContainer";
import { TextInputBase } from "@components/TextInput/TextInputBase";
import { useAppDispatch, useAppSelector, useToast } from "@hooks";
import { setLoading, setUser } from "@store";
import { APP_PADDING, AUTH_SCREEN_IMAGE_HEIGHT } from "@theme";
import type {
  AuthTextInputProps,
  LocalUser,
  SignUpFormProps,
  SignUpFormTextInputProps,
  SignUpScreenProps,
} from "@types";
import { lookupImageSize, trpc } from "@utils";

const { imageHeight, imageWidth } = lookupImageSize("welcomeCats");

const signUpFormSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password is required - 8 chars min" }),
    passwordConfirmation: z
      .string()
      .min(8, { message: "Password is required - 8 chars min" }),
  })
  .refine(
    ({ password, passwordConfirmation }) => password === passwordConfirmation,
    { message: "Passwords must match", path: ["passwordConfirmation"] }
  );

export const SignUpScreen = ({
  navigation,
  route: { params },
}: SignUpScreenProps) => {
  const [emailAddressCopy, setEmailAddressCopy] = useState<string>("");

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
  } = useForm<SignUpFormProps>({
    mode: "onTouched",
    resolver: zodResolver(signUpFormSchema),
  });

  const { mutateAsync: signUpMutateAsync } =
    trpc.inertiion.auth.signUp.useMutation();

  const { showToast } = useToast();

  const onSubmit: SubmitHandler<SignUpFormProps> = async ({
    email,
    password,
  }) => {
    dispatch(setLoading(true));

    const res = await signUpMutateAsync({
      application: "inertiion",
      email,
      password,
    });

    if (typeof res === "string") {
      showToast({ message: res });

      resetField("password");
      resetField("passwordConfirmation");
    } else {
      const token = res.token;

      await SecureStore.setItemAsync("token", token);

      const userData = res.userData as LocalUser;

      dispatch(setUser({ id: userData.id, email: userData.email }));

      showToast({ message: "Successfully signed up!" });

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
        <WelcomeAltImage
          height={AUTH_SCREEN_IMAGE_HEIGHT}
          width={(imageWidth / imageHeight) * AUTH_SCREEN_IMAGE_HEIGHT}
        />
      </View>
      <SignUpFormTextInput
        additionalOnChange={(text) => {
          setEmailAddressCopy(() => text);
        }}
        control={control}
        editable={!loading}
        keyboardType="email-address"
        name="email"
        placeholder="Email"
      />
      <SignUpFormTextInput
        control={control}
        editable={!loading}
        name="password"
        placeholder="Password"
        secure
      />
      <SignUpFormTextInput
        control={control}
        editable={!loading}
        name="passwordConfirmation"
        placeholder="Confirm Password"
        secure
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <ButtonBase
            disabled={!!loading || !!errors["email"]}
            onPress={() => {
              navigation.navigate("LoginScreen", {
                email: emailAddressCopy || params?.email,
              });

              reset();
              clearErrors();
            }}
            title="Log In"
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <ButtonBase
            disabled={!!loading}
            marginRight
            onPress={() => {
              clearErrors();
              reset();
            }}
            title="Clear"
            type="secondary"
          />
          <ButtonBase
            disabled={
              !!loading ||
              !!errors["email"] ||
              !!errors["password"] ||
              !!errors["passwordConfirmation"]
            }
            onPress={handleSubmit(onSubmit)}
            title="Sign Up"
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const SignUpFormTextInput = ({
  additionalOnChange,
  control,
  defaultValue,
  name,
  secure,
  ...props
}: AuthTextInputProps &
  SignUpFormTextInputProps &
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

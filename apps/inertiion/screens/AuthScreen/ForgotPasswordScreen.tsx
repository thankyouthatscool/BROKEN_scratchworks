import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";

import ForgotPasswordImage from "@assets/forgot-password.svg";
import { ButtonBase } from "@components/Button";
import { ErrorMessageText } from "@components/ErrorMessageText";
import { ScreenContainer } from "@components/ScreenContainer";
import { TextInputBase } from "@components/TextInput";
import { useAppDispatch, useAppSelector, useToast } from "@hooks";
import { setLoading } from "@/store";
import { APP_PADDING, AUTH_SCREEN_IMAGE_HEIGHT } from "@theme";
import {
  AuthTextInputProps,
  ForgotPasswordFormCodeProps,
  ForgotPasswordFormCodeTextInputProps,
  ForgotPasswordFormEmailProps,
  ForgotPasswordFormEmailTextInputProps,
  ForgotPasswordFormPasswordProps,
  ForgotPasswordFormPasswordTextInputProps,
  ForgotPasswordScreenProps,
} from "@types";
import { lookupImageSize, trpc } from "@utils";

const { imageHeight, imageWidth } = lookupImageSize("forgotPassword");

const emailFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const codeFormSchema = z.object({ code: z.string() });

const passwordFormSchema = z
  .object({
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

export const ForgotPasswordScreen = ({
  navigation,
  route: { params },
}: ForgotPasswordScreenProps) => {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector(({ app }) => app);

  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<"code" | "email" | "password">(
    "email"
  );
  const [emailCopy, setEmailCopy] = useState<string>("");

  const {
    clearErrors: emailClearErrors,
    control: emailControl,
    formState: { errors: emailErrors },
    handleSubmit: emailHandleSubmit,
    reset: emailReset,
    resetField: emailResetField,
    setValue: emailSetValue,
  } = useForm<ForgotPasswordFormEmailProps>({
    mode: "onChange",
    resolver: zodResolver(emailFormSchema),
  });

  const {
    clearErrors: codeClearErrors,
    control: codeControl,
    formState: { errors: codeErrors },
    handleSubmit: codeHandleSubmit,
    reset: codeReset,
    resetField: codeResetField,
    setValue: codeSetValue,
  } = useForm<ForgotPasswordFormCodeProps>({
    mode: "onChange",
    resolver: zodResolver(codeFormSchema),
  });

  const {
    clearErrors: passwordClearErrors,
    control: passwordControl,
    formState: { errors: passwordErrors },
    handleSubmit: passwordHandleSubmit,
    reset: passwordReset,
    resetField: passwordResetField,
    setValue: passwordSetValue,
  } = useForm<ForgotPasswordFormPasswordProps>({
    mode: "onChange",
    resolver: zodResolver(passwordFormSchema),
  });

  useEffect(() => {
    if (params?.email) {
      emailSetValue("email", params.email);
    }
  }, [params]);

  const { mutateAsync: sendVerificationCodeMutateAsync } =
    trpc.inertiion.auth.sendVerificationCode.useMutation();

  const { mutateAsync: verifyCodeCheckAsync } =
    trpc.inertiion.auth.verifyCode.useMutation();

  const { mutateAsync: changePasswordMutateAsync } =
    trpc.inertiion.auth.changePassword.useMutation();

  const onEmailSubmit: SubmitHandler<ForgotPasswordFormEmailProps> = async ({
    email,
  }) => {
    dispatch(setLoading(true));

    const res = await sendVerificationCodeMutateAsync(email);

    if (res === "OK") {
      setCurrentStep(() => "code");
    } else {
      showToast({ message: res });
    }

    dispatch(setLoading(false));
  };

  const onCodeSubmit: SubmitHandler<ForgotPasswordFormCodeProps> = async ({
    code,
  }) => {
    dispatch(setLoading(true));

    const res = await verifyCodeCheckAsync({ code, email: emailCopy });

    if (res === "OK") {
      setCurrentStep(() => "password");
    } else {
      showToast({ message: res });
    }

    dispatch(setLoading(false));
  };

  const onPasswordSubmit: SubmitHandler<
    ForgotPasswordFormPasswordProps
  > = async ({ password }) => {
    dispatch(setLoading(true));

    const res = await changePasswordMutateAsync({ email: emailCopy, password });

    if (res === "OK") {
      showToast({ message: "Password successfully changed." });

      navigation.navigate("LoginScreen", { email: emailCopy });
    } else {
      showToast({ message: res });
    }

    dispatch(setLoading(false));
  };

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
          <ForgotPasswordFormEmailTextInput
            additionalOnChange={(text) => {
              setEmailCopy(() => text);
            }}
            control={emailControl}
            editable={!loading}
            keyboardType="email-address"
            name="email"
            placeholder="Email"
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <View>
              <ButtonBase
                disabled={!!loading}
                marginRight
                onPress={() => {
                  emailReset();
                  emailClearErrors();

                  navigation.goBack();
                }}
                title="Cancel"
                type="secondary"
              />
            </View>
            <View>
              <ButtonBase
                disabled={!!loading || !!emailErrors["email"]}
                onPress={emailHandleSubmit(onEmailSubmit)}
                title="Send Code"
              />
            </View>
          </View>
        </View>
      )}

      {/* Current Step: Code */}

      {currentStep === "code" && (
        <View>
          <ForgotPasswordFormCodeTextInput
            control={codeControl}
            editable={!loading}
            keyboardType="number-pad"
            name="code"
            placeholder="Code"
          />
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <ButtonBase
              disabled={!!loading}
              marginRight
              onPress={() => {
                setCurrentStep(() => "email");
              }}
              title="Back"
              type="secondary"
            />
            <ButtonBase
              disabled={!!loading || !!codeErrors["code"]}
              onPress={codeHandleSubmit(onCodeSubmit)}
              title="Verify Code"
            />
          </View>
        </View>
      )}

      {/* Current Step: Password */}

      {currentStep === "password" && (
        <View>
          <ForgotPasswordFormPasswordTextInput
            control={passwordControl}
            editable={!loading}
            name="password"
            placeholder="Password"
            secure
          />
          <ForgotPasswordFormPasswordTextInput
            control={passwordControl}
            editable={!loading}
            name="passwordConfirmation"
            placeholder="Confirm Password"
            secure
          />
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <ButtonBase
              disabled={!!loading}
              marginRight
              onPress={() => {
                navigation.navigate("LoginScreen", {});
              }}
              title="Cancel"
              type="secondary"
            />
            <ButtonBase
              disabled={
                !!loading ||
                !!passwordErrors["password"] ||
                !!passwordErrors["passwordConfirmation"]
              }
              onPress={passwordHandleSubmit(onPasswordSubmit)}
              title="Set New Password"
            />
          </View>
        </View>
      )}
    </ScreenContainer>
  );
};

const ForgotPasswordFormEmailTextInput = ({
  additionalOnChange,
  control,
  defaultValue,
  name,
  secure,
  ...props
}: AuthTextInputProps &
  ForgotPasswordFormEmailTextInputProps &
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

const ForgotPasswordFormCodeTextInput = ({
  additionalOnChange,
  control,
  defaultValue,
  name,
  secure,
  ...props
}: AuthTextInputProps &
  ForgotPasswordFormCodeTextInputProps &
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

const ForgotPasswordFormPasswordTextInput = ({
  additionalOnChange,
  control,
  defaultValue,
  name,
  secure,
  ...props
}: AuthTextInputProps &
  ForgotPasswordFormPasswordTextInputProps &
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

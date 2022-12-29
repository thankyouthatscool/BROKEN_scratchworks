import { Control } from "react-hook-form";

export type AuthTextInputProps = {
  additionalOnChange?: (value: string) => void;
  secure?: boolean;
};

// Log In Form
export type LogInFormProps = { email: string; password: string };

export type LogInFormFieldNames = keyof LogInFormProps;

export type LogInFormTextInputProps = {
  control: Control<LogInFormProps>;
  name: LogInFormFieldNames;
};

// Sign Up Form
export type SignUpFormProps = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type SignUpFormFieldNames = keyof SignUpFormProps;

export type SignUpFormTextInputProps = {
  control: Control<SignUpFormProps>;
  name: SignUpFormFieldNames;
};

// Forgot Password Form
// Email
export type ForgotPasswordFormEmailProps = {
  email: string;
};

export type ForgotPasswordFormEmailFieldNames =
  keyof ForgotPasswordFormEmailProps;

export type ForgotPasswordFormEmailTextInputProps = {
  control: Control<ForgotPasswordFormEmailProps>;
  name: ForgotPasswordFormEmailFieldNames;
};

// Code
export type ForgotPasswordFormCodeProps = {
  code: string;
};

export type ForgotPasswordFormCodeFieldNames =
  keyof ForgotPasswordFormCodeProps;

export type ForgotPasswordFormCodeTextInputProps = {
  control: Control<ForgotPasswordFormCodeProps>;
  name: ForgotPasswordFormCodeFieldNames;
};

// Password
export type ForgotPasswordFormPasswordProps = {
  password: string;
  passwordConfirmation: string;
};

export type ForgotPasswordFormPasswordFieldNames =
  keyof ForgotPasswordFormPasswordProps;

export type ForgotPasswordFormPasswordTextInputProps = {
  control: Control<ForgotPasswordFormPasswordProps>;
  name: ForgotPasswordFormPasswordFieldNames;
};

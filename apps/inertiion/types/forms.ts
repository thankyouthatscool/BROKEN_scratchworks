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

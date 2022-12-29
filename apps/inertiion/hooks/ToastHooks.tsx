import Toast from "react-native-root-toast";

const defaultToastSettings = {
  animation: true,
  duration: Toast.durations.SHORT,
  hideOnPress: true,
  position: Toast.positions.BOTTOM,
  shadow: true,
};

interface ShowToastProps {
  message: string;
  options?: {
    animation?: boolean;
    duration?: "short" | "long" | number;
    hideOnPress?: boolean;
    shadow?: boolean;
  };
}

export const useToast = () => {
  return {
    showToast: ({ message, options }: ShowToastProps) => {
      Toast.show(message, {
        ...defaultToastSettings,
        animation: !!options?.animation,

        duration:
          typeof options?.duration === "number"
            ? options.duration
            : options?.duration === "long"
            ? Toast.durations.LONG
            : Toast.durations.SHORT,
        hideOnPress: !!options?.hideOnPress,
        shadow: !!options?.shadow,
      });
    },
  };
};

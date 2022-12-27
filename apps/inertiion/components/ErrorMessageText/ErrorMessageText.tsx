import { Text, View } from "react-native";

import {
  APP_PADDING,
  ERROR_MESSAGE_FONT_COLOR,
  ERROR_MESSAGE_FONT_SIZE,
} from "@theme";

export const ErrorMessageText = ({ message }: { message: string }) => {
  return (
    <View style={{ padding: APP_PADDING }}>
      <Text
        style={{
          color: ERROR_MESSAGE_FONT_COLOR,
          fontSize: ERROR_MESSAGE_FONT_SIZE,
        }}
      >
        {message}
      </Text>
    </View>
  );
};

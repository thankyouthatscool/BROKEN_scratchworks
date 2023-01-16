import { Text, View } from "react-native";

export const ProgressBar = ({ percentDone }: { percentDone: number }) => {
  return (
    <View style={{ height: 15, marginVertical: 8 }}>
      <View
        style={{
          backgroundColor: "green",
          borderRadius: 5,
          height: "100%",

          width: `${percentDone * 100}%`,
        }}
      />
    </View>
  );
};

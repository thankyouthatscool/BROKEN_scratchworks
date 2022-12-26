import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppRoot } from "@components";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppRoot />
    </SafeAreaProvider>
  );
}

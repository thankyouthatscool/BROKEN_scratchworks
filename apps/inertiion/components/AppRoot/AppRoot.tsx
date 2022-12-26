import { useCallback, useEffect, useRef } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const AppRoot = () => {
  const initialLoadRef = useRef<boolean>(false);

  const handleInitialLoad = useCallback(() => {
    console.log("Doing the initial load...");
  }, []);

  useEffect(() => {
    if (!initialLoadRef.current) {
      handleInitialLoad();
    }

    initialLoadRef.current = true;
  }, [initialLoadRef]);

  return (
    <SafeAreaView>
      <Text>App Root</Text>
    </SafeAreaView>
  );
};

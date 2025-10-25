import { StatusBar } from "expo-status-bar";
import { AppNavigator } from "./navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: "#fff" }}>
      <AppNavigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

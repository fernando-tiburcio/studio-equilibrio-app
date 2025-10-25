import { StatusBar } from "expo-status-bar";
import { AppNavigator } from "./navigation";
import { PaperProvider } from "react-native-paper";
import { theme } from "./theme";
import { View } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <AppNavigator />
      </PaperProvider>
      <StatusBar style="auto" />
    </View>
  );
}

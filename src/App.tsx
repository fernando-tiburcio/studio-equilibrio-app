import React from "react";
import { StatusBar } from "expo-status-bar";
import { AppNavigator } from "./navigation";
import { PaperProvider } from "react-native-paper";
import { theme } from "./theme";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAuth } from "./hooks/useAuth";
import { View, ActivityIndicator, StyleSheet } from "react-native";

if (__DEV__) {
  require("../ReactotronConfig.ts");
}

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <Provider store={store}>
          <AppContent />
        </Provider>
      </PaperProvider>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

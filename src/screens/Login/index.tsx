import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {/* Implementar formulário de login aqui */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

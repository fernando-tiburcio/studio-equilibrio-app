import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const ForgotPasswordScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Esqueci minha senha</Text>
      {/* Implementar formulário de recuperação de senha aqui */}
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

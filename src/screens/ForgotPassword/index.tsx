import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PublicStackParamList } from "../../navigation/publicRoutes";
import { apiService } from "../../services/api";

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  PublicStackParamList,
  "ForgotPassword"
>;

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async () => {
    setError("");

    if (!email.trim()) {
      setError("Email é obrigatório");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email inválido");
      return;
    }

    setLoading(true);
    try {
      await apiService.forgotPassword({ email });
      setSuccess(true);
      Alert.alert(
        "Email enviado",
        "Verifique sua caixa de entrada para redefinir sua senha.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Erro ao solicitar recuperação de senha"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <Text style={styles.title}>Esqueceu sua senha?</Text>
        <Text style={styles.subtitle}>
          Informe seu email e enviaremos instruções para recuperar sua senha
        </Text>

        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={!!error}
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          {success && (
            <Text style={styles.successText}>
              Email de recuperação enviado com sucesso!
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleForgotPassword}
            loading={loading}
            disabled={loading || success}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Enviar instruções
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Voltar para login
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  successText: {
    color: "#2e7d32",
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  button: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 16,
  },
});

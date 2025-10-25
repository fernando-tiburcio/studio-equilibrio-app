import { View, Text, StyleSheet } from "react-native";

export const WorkoutsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Treinos</Text>
      <Text style={styles.subtitle}>Acompanhe seus treinos e exercícios</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

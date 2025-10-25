import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PublicRoutes } from "./publicRoutes";
import { PrivateRoutes } from "./privateRoutes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";

export const AppNavigator = () => {
  // Por enquanto, vamos usar as rotas privadas diretamente
  // Em uma implementação real, você verificaria se o usuário está autenticado
  const isAuthenticated = true; // Simular usuário autenticado
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer>
      <View
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        {isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />}
      </View>
    </NavigationContainer>
  );
};

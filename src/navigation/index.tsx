import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PublicRoutes } from "./publicRoutes";
import { PrivateRoutes } from "./privateRoutes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import { useAuth } from "../hooks/useAuth";

export const AppNavigator = () => {
  const { isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer>
      <View
        style={{
          paddingTop: insets.top,
          // paddingBottom: insets.bottom,
          flex: 1,
          backgroundColor: "#ffffff",
        }}
      >
        {isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />}
      </View>
    </NavigationContainer>
  );
};

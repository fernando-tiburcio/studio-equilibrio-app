import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/Login";
import { ForgotPasswordScreen } from "../screens/ForgotPassword";

export type PublicStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<PublicStackParamList>();

export const PublicRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/Home";
import { ProfileScreen } from "../screens/Profile";
import { WorkoutsScreen } from "../screens/Workouts";
import { SubdivisionDetailsScreen } from "../screens/SubdivisionDetails";
import { ExerciseDetailsScreen } from "../screens/ExerciseDetails";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();
const WorkoutsStack = createNativeStackNavigator();

const WorkoutsStackNavigator = () => {
  return (
    <WorkoutsStack.Navigator screenOptions={{ headerShown: false }}>
      <WorkoutsStack.Screen name="WorkoutsList" component={WorkoutsScreen} />
      <WorkoutsStack.Screen
        name="SubdivisionDetails"
        component={SubdivisionDetailsScreen}
      />
      <WorkoutsStack.Screen
        name="ExerciseDetails"
        component={ExerciseDetailsScreen}
      />
    </WorkoutsStack.Navigator>
  );
};

export const PrivateRoutes = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          paddingBottom: insets.bottom,
          paddingTop: 5,
          height: 60 + insets.bottom,
        },
        tabBarActiveTintColor: "#10b981",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Início",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Workouts"
        component={WorkoutsStackNavigator}
        options={{
          tabBarLabel: "Treinos",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="fitness-center" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

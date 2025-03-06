import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Image } from "react-native"; // Import Image component
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import FavouriteScreen from "./src/screens/FavouriteScreen";
import NearbyScreen from "./src/screens/NearbyScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import { AuthProvider } from "./src/context/AuthContext"; // ✅ Make sure the path is correct

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import homeIcon from "./assets/home.png";
import favouriteIcon from "./assets/favourite.png";
import nearbyIcon from "./assets/nearby.png";
import profileIcon from "./assets/profile-user.png";

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#E63946", // Neon Red (Active Tab)
        tabBarInactiveTintColor: "#A8DADC", // Muted Cyan (Inactive Tab)
        tabBarStyle: { backgroundColor: "#1A1A1A", height: 60 }, // Dark Background
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={homeIcon}
              style={{ width: 24, height: 24, tintColor: focused ? "#F4A261" : "#B0B0B0" }} // Warm Orange (Active), Muted Gray (Inactive)
            />
          ),
          headerStyle: { backgroundColor: "#1A1A1A" }, // Header Background
          headerTitleStyle: { color: "#F1FAEE" }, // Soft White Text
        }}
      />
      <Tab.Screen
        name="Favourite"
        component={FavouriteScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={favouriteIcon}
              style={{ width: 24, height: 24, tintColor: focused ? "#F4A261" : "#B0B0B0" }}
            />
          ),
          headerStyle: { backgroundColor: "#1A1A1A" },
          headerTitleStyle: { color: "#F1FAEE" },
        }}
      />
      <Tab.Screen
        name="Nearby"
        component={NearbyScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={nearbyIcon}
              style={{ width: 24, height: 24, tintColor: focused ? "#F4A261" : "#B0B0B0" }}
            />
          ),
          headerStyle: { backgroundColor: "#1A1A1A" },
          headerTitleStyle: { color: "#F1FAEE" },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={profileIcon}
              style={{ width: 24, height: 24, tintColor: focused ? "#F4A261" : "#B0B0B0" }}
            />
          ),
          headerStyle: { backgroundColor: "#1A1A1A" },
          headerTitleStyle: { color: "#F1FAEE" },
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerStyle: { backgroundColor: "#1A1A1A" }, // Header Bar Background
          headerTitleStyle: { color: "#F1FAEE" }, // Header Title Color (Soft White)
          headerTintColor: "#F4A261", // Back Button Color (Warm Orange)
        }}
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

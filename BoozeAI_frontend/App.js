import React, {useEffect} from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Image, Platform } from "react-native"; // Import Image component
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import FavouriteScreen from "./src/screens/FavouriteScreen";
import NearbyScreen from "./src/screens/NearbyScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import DrinkDetailScreen from "./src/screens/DrinkDetailScreen";
import TruthOrDareScreen from "./src/screens/TruthOrDareScreen";
import KnowledgeHubScreen from "./src/screens/KnowledgeHubScreen";
import mobileAds from "react-native-google-mobile-ads"; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { StatusBar } from "react-native";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import homeIcon from "./assets/home.png";
import favouriteIcon from "./assets/favourite.png";
import nearbyIcon from "./assets/nearby.png";
import profileIcon from "./assets/profile-user.png";
import TruthOrDare from "./assets/beer.png";
import knowledgeIcon from "./assets/knowledge.png";

function MainTabs() {
  return (
    <>
    <StatusBar backgroundColor="#1C1C3A" barStyle="light-content" />
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#fff", // Neon Red (Active Tab)
        tabBarInactiveTintColor: "#A8A8A8", // Muted Cyan (Inactive Tab)
        tabBarStyle: { 
          backgroundColor: "#1C1C3A", 
          height: Platform.OS === 'android' ? 70 : 60,
          paddingBottom: Platform.OS === 'android' ? 10 : 5,
          paddingTop: 2,
        }, // Dark Background
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={homeIcon}
              style={{ width: 24, height: 24, tintColor: focused ? "#8e44ad" : "#B0B0B0" }} // Warm Orange (Active), Muted Gray (Inactive)
            />
          ),
          headerStyle: { 
            backgroundColor: "#1C1C3A", 
            height: Platform.OS === 'android' ? 80 : 60 
          }, // Header Background
          headerTitleStyle: { color: "#fff" }, // Soft White Text
        }}
      />
      <Tab.Screen
        name="Favourite"
        component={FavouriteScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={favouriteIcon}
              style={{ width: 24, height: 24, tintColor: focused ? "#8e44ad" : "#B0B0B0" }}
            />
          ),
          headerStyle: { 
            backgroundColor: "#1C1C3A",
            height: Platform.OS === 'android' ? 80 : 60
          },
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Tab.Screen
        name="Nearby"
        component={NearbyScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={nearbyIcon}
              style={{ width: 24, height: 24, tintColor: focused ? "#8e44ad" : "#B0B0B0" }}
            />
          ),
          headerStyle: { 
            backgroundColor: "#1C1C3A",
            height: Platform.OS === 'android' ? 80 : 60
          },
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Tab.Screen
  name="Game"
  component={TruthOrDareScreen}
  options={{
    tabBarIcon: ({ focused }) => (
      <Image
        source={TruthOrDare}
        style={{
          width: 24,
          height: 24,
          tintColor: focused ? "#8e44ad" : "#B0B0B0"
        }}
      />
    ),
    headerStyle: { 
      backgroundColor: "#1C1C3A",
      height: Platform.OS === 'android' ? 80 : 60
    },
    headerTitleStyle: { color: "#fff" },
    title: "Truth or Dare",
  }}
/>

      <Tab.Screen
        name="Learn"
        component={KnowledgeHubScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={knowledgeIcon}
              style={{ width: 24, height: 24, tintColor: focused ? "#8e44ad" : "#B0B0B0" }}
            />
          ),
          headerStyle: { 
            backgroundColor: "#1C1C3A",
            height: Platform.OS === 'android' ? 80 : 60
          },
          headerTitleStyle: { color: "#fff" },
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={profileIcon}
              style={{ width: 24, height: 24, tintColor: focused ? "#8e44ad" : "#B0B0B0" }}
            />
          ),
          headerStyle: { 
            backgroundColor: "#1C1C3A",
            height: Platform.OS === 'android' ? 80 : 60
          },
          headerTitleStyle: { color: "#fff" },
        }}
      />
    </Tab.Navigator>
    </>
  );
}

export default function App() {
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(() => {
        console.log("Google Mobile Ads initialized");
      })
      .catch((error) => console.error("Ads Initialization Error:", error));
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerStyle: { backgroundColor: "#1C1C3A" }, // Header Bar Background
          headerTitleStyle: { color: "#fff" }, // Header Title Color (Soft White)
          headerTintColor: "#8e44ad", // Back Button Color (Warm Orange)
        }}
      >
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="DrinkDetail" component={DrinkDetailScreen} options={{ title: "Drink Details" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

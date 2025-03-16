import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode"; 

const AuthScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "681703836270-6q4v848tul61o6luu2t34m1spcfp87sj.apps.googleusercontent.com",
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  
    let isNavigated = false; // 🔹 Prevent duplicate navigation
  
    const checkUser = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
  
        if (!token) {
          console.log("No token found. Redirecting to login.");
          setLoading(false);
          return;
        }
  
        // 🔹 Decode token and check expiry
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
  
        if (decodedToken.exp < currentTime) {
          console.log("Token expired. Logging out...");
          await handleLogout();
          return;
        }
  
        // 🔹 Listen for Firebase Auth State Change
        const unsubscribe = auth().onAuthStateChanged(async (user) => {
          if (user && !isNavigated) {
            console.log("User is logged in:", user.email);
            isNavigated = true; // ✅ Prevent duplicate navigation
            navigation.replace("MainTabs");
          } else if (!user) {
            console.log("No Firebase user. Logging out...");
            await handleLogout();
          }
          setLoading(false);
        });
  
        return () => unsubscribe();
      } catch (error) {
        console.error("Error restoring session:", error);
        setLoading(false);
      }
    };
  
    checkUser();
  }, []);
  

  const handleLogout = async () => {
    try {
      // Remove stored JWT token
      await AsyncStorage.removeItem("token");
  
      // Sign out from Firebase Auth
      await auth().signOut();
  
      // Check if the user is signed in before calling revokeAccess
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await GoogleSignin.signOut(); // ✅ Sign out first
        await GoogleSignin.revokeAccess(); // ✅ Revoke Google access last
      }
  
      // Navigate to login screen
      navigation.replace("AuthScreen");
    } catch (error) {
      console.error("Manual Logout Error:", error);
      Alert.alert("Logout Failed", error.message || "An unexpected error occurred.");
    }
  };
  

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo?.idToken || userInfo?.data?.idToken;

      if (!idToken) {
        throw new Error("No Google ID Token found in response");
      }

      const firebaseUser = await auth().signInWithCredential(auth.GoogleAuthProvider.credential(idToken));
      const firebaseIdToken = await firebaseUser.user.getIdToken(true);
      const response = await fetch("https://boozeai.onrender.com/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: firebaseIdToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // 🔹 Store JWT token
      await AsyncStorage.setItem("token", data.token);
      console.log("Token stored successfully!");

      // 🔹 Navigate to HomeScreen
      navigation.replace("MainTabs");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Sign-in Error", error.message || "Something went wrong!");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ffcc00" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to BoozeAI!</Text>
      <Text style={styles.subtitle}>Your AI-powered bartender 🍹</Text>
      <Button title="Sign in with Google" onPress={signInWithGoogle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#6c34cf' },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#bbb" },
});

export default AuthScreen;

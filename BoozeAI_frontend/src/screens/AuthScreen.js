import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthScreen = ({ navigation }) => {
  useEffect(() => {
    // Configure GoogleSignin for Firebase authentication
    GoogleSignin.configure({
      webClientId: "681703836270-6q4v848tul61o6luu2t34m1spcfp87sj.apps.googleusercontent.com", // Make sure this is set correctly
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });

    const checkSignedIn = async () => {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        // Automatically proceed with the navigation
        navigation.replace("MainTabs");
      }
    };
    checkSignedIn();
  }, []);

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
      const response = await fetch("http://10.0.2.2:5001/api/auth/google-login", {
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
  
  
  
  
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to BoozeAI!</Text>
      <Text style={styles.subtitle}>Your AI-powered bartender 🍹</Text>
      <Button title="Sign in with Google" onPress={signInWithGoogle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor:'#6c34cf' },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
});

export default AuthScreen;
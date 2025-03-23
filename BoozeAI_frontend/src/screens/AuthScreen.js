import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import LottieView from "lottie-react-native";

const AuthScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "681703836270-6q4v848tul61o6luu2t34m1spcfp87sj.apps.googleusercontent.com",
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });

    let isNavigated = false;

    const checkUser = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          console.log("No token found. Redirecting to login.");
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          await handleLogout();
          return;
        }

        const unsubscribe = auth().onAuthStateChanged(async (user) => {
          if (user && !isNavigated) {
            isNavigated = true;
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
      await AsyncStorage.removeItem("token");
  
      const currentUser = auth().currentUser;
      if (currentUser) {
        await auth().signOut();
      }
  
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await GoogleSignin.signOut();
        await GoogleSignin.revokeAccess();
      }
  
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

      await AsyncStorage.setItem("token", data.token);
      navigation.replace("MainTabs");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Sign-in Error", error.message || "Something went wrong!");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <LottieView
          source={require("../../assets/loading1.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/loading1.json")}
        autoPlay
        loop
        style={styles.lottieWelcome}
      />
      <Text style={styles.title}>Welcome to BoozeAI!</Text>
      <Text style={styles.subtitle}>Your AI-powered bartender 🍹</Text>

      <TouchableOpacity style={styles.googleButton} onPress={signInWithGoogle}>
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1C1C3A" },
  title: { fontSize: 26, fontWeight: "bold", color: "#F8E71C", marginTop: 20 },
  subtitle: { fontSize: 16, color: "#C5CAE9", marginBottom: 20, textAlign: "center", paddingHorizontal: 20 },
  
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1C1C3A" },
  lottie: { width: 140, height: 140 },
  loadingText: { marginTop: 15, fontSize: 16, fontWeight: "bold", color: "#C5CAE9" },

  lottieWelcome: { width: 180, height: 180, marginBottom: 10 },

  googleButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  googleButtonText: { fontSize: 16, fontWeight: "bold", color: "#1C1C3A" },
});

export default AuthScreen;

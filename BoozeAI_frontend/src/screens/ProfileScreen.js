import React, { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import {
    View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";


const ProfileScreen = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (!token) {
                    Alert.alert("Session Expired", "Please log in again.");
                    navigation.replace("Auth");
                    return;
                }

                const response = await fetch("https://boozeai.onrender.com/api/drinks/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token.trim()}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP Status ${response.status}`);
                }

                const data = await response.json();
                console.log("Profile Data:", data);
                setUser(data); // ✅ Update user state
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false); // ✅ Ensure loading is set to false in all cases
            }
        };

        fetchProfile();
    }, [navigation]); // ✅ Dependency added to avoid issues

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#E63946" />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={{ color: "white", fontSize: 18 }}>User data not found</Text>
            </View>
        );
    }

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("token"); // 🔹 Remove stored JWT token
            await GoogleSignin.revokeAccess(); // 🔹 Revoke Google access (optional)
            await GoogleSignin.signOut(); // 🔹 Sign out from Google
            await auth().signOut(); // 🔹 Sign out from Firebase Auth

            navigation.replace("Auth"); // 🔹 Navigate to login screen
        } catch (error) {
            console.error("Logout Error:", error);
            Alert.alert("Logout Failed", "Something went wrong while logging out.");
        }
    };


    return (
        <View style={styles.container}>
            {/* Profile Picture */}
            <Image
                source={user.avatar ? { uri: user.avatar } : require("../../assets/man.png")}
                style={styles.avatar}
            />

            {/* User Info */}
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>

            {/* History Button */}
            <TouchableOpacity
                style={styles.historyButton}
                onPress={() => navigation.navigate("HistoryScreen")}
            >
                <Text style={styles.historyButtonText}>View History</Text>
            </TouchableOpacity>

            {/* 🔹 Logout Button */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>

    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
        padding: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: "#F1FAEE",
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#F1FAEE",
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: "#A8DADC",
        marginBottom: 20,
    },
    historyButton: {
        backgroundColor: "#E63946",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
    },
    historyButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    logoutButton: {
        backgroundColor: "#D90429",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginTop: 20, // 🔹 Space between buttons
    },
    logoutButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    
});

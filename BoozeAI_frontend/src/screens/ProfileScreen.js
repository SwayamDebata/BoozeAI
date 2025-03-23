import React, { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import {
    View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import LottieView from "lottie-react-native";

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
                setUser(data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigation]);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <View style={styles.lottieWrapper}>
                    <LottieView
                        source={require("../../assets/loading1.json")}
                        autoPlay
                        loop
                        style={styles.lottieAnimation}
                    />
                </View>
                <Text style={styles.loadingText}>Loading your profile...</Text>
            </View>
        );
    }
    

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.noUserText}>User data not found</Text>
            </View>
        );
    }

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("token");
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            await auth().signOut();
            navigation.replace("Auth");
        } catch (error) {
            console.error("Logout Error:", error);
            Alert.alert("Logout Failed", "Something went wrong while logging out.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileCard}>
                <Image
                    source={user.avatar ? { uri: user.avatar } : require("../../assets/man.png")}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Your Boozy Journey:</Text>
                <Text style={styles.infoText}>Sipping and savoring since who knows when!</Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
        backgroundColor: "#1C1C3A",
        padding: 20,
    },
    profileCard: {
        alignItems: "center",
        backgroundColor: "#3A2E6E",
        padding: 20,
        borderRadius: 12,
        width: "100%",
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: "#D1C4E9",
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#EDE7F6",
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: "#C5CAE9",
        marginBottom: 15,
    },
    infoContainer: {
        backgroundColor: "#2A1E5C",
        padding: 15,
        borderRadius: 10,
        width: "100%",
        marginBottom: 20,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#EDE7F6",
    },
    infoText: {
        fontSize: 14,
        color: "#C5CAE9",
        marginBottom: 8,
    },
    logoutButton: {
        backgroundColor: "#5D3FD3",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignItems: "center",
        width: "100%",
    },
    logoutButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    noUserText: {
        color: "#C5CAE9",
        fontSize: 18,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1C1C3A", // Keep it consistent with the theme
    },
    lottieWrapper: {
        width: 120, 
        height: 120,
        borderRadius: 60, // Circular border
        overflow: "hidden",
        backgroundColor: "rgba(28, 28, 58, 0.6)", // Subtle transparency
        borderWidth: 3,  
        borderColor: "#D1C4E9", // Light lavender border to match theme
        justifyContent: "center",
        alignItems: "center",
    },
    lottieAnimation: {
        width: "100%",
        height: "100%",
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: "bold",
        color: "#C5CAE9",
    },
});
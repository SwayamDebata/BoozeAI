import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated , SafeAreaView} from "react-native";
import LottieView from "lottie-react-native";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
import { AdsConsent } from 'react-native-google-mobile-ads';

const DrinkDetailScreen = ({ route, navigation }) => {
    const { drinkSuggestion, token } = route.params || {};
    const [isFavorited, setIsFavorited] = useState(false);
    const scaleAnim = new Animated.Value(1);
    const [showAnimation, setShowAnimation] = useState(false);

    if (!drinkSuggestion || !drinkSuggestion.description) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading drink details...</Text>
            </View>
        );
    }

    const extractDetails = (description) => {
        const details = {};
        description.split("\n").forEach((line) => {
            if (line.startsWith("Cocktail Name:")) details.name = line.replace("Cocktail Name:", "").trim();
            else if (line.startsWith("Mood:")) details.mood = line.replace("Mood:", "").trim();
            else if (line.startsWith("Weather:")) details.weather = line.replace("Weather:", "").trim();
            else if (line.startsWith("Ingredients:")) details.ingredients = line.replace("Ingredients:", "").trim();
            else if (line.startsWith("Instructions:")) details.instructions = line.replace("Instructions:", "").trim();
            else if (line.startsWith("Budget:")) details.budget = line.replace("Budget:", "").trim();
        });
        return details;
    };

    const drinkDetails = extractDetails(drinkSuggestion.description);
    const adUnitId = __DEV__
  ? TestIds.BANNER 
  : "ca-app-pub-4693002133615714/9025916110"; 

    const addToFavourite = async () => {
        if (!drinkSuggestion || !drinkSuggestion.id) {
            alert("Drink ID is missing!");
            return;
        }

        try {
            const response = await fetch("https://boozeai.onrender.com/api/drinks/favourites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.trim()}`,
                },
                body: JSON.stringify({ drinkId: drinkSuggestion.id }),
            });

            const data = await response.json();
            if (response.ok) {
                setIsFavorited(true);
                setShowAnimation(true); 
                setTimeout(() => setShowAnimation(false), 2000);
                Animated.sequence([
                    Animated.timing(scaleAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
                    Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
                ]).start();
            } else {
                alert(data.error || "Failed to add to favourites");
            }
        } catch (error) {
            console.error("Error adding to favourites:", error);
            alert("Something went wrong!");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>{drinkDetails.name || "Unknown Drink"}</Text>
                <View style={styles.card}>
                    <Text style={styles.label}>🍸 Ingredients</Text>
                    <Text style={styles.value}>{drinkDetails.ingredients}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>📜 Instructions</Text>
                    <Text style={styles.value}>{drinkDetails.instructions}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>💰 Budget</Text>
                    <Text style={styles.value}>{drinkDetails.budget}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={addToFavourite} activeOpacity={0.7}>
                        <Animated.View style={[styles.favButton, { transform: [{ scale: scaleAnim }] }]}>
                            <Text style={styles.favButtonText}>{isFavorited ? "❤️" : "🤍"} Add to Favourite</Text>
                        </Animated.View>
                    </TouchableOpacity>
                    {showAnimation && (
                        <LottieView
                            source={require("../../assets/addtofav.json")}
                            autoPlay
                            loop={false}
                            style={styles.lottie}
                        />
                    )}
                    <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <SafeAreaView style={styles.adContainer}>
                <BannerAd
                    unitId={adUnitId}
                    size={BannerAdSize.BANNER}
                    requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                />
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1C1C3A",
        alignItems: "center",
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    scrollContent: {
        alignItems: "center",
        paddingBottom: 50,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#D1C4E9",
        textAlign: "center",
        marginBottom: 20,
    },
    card: {
        padding: 15,
        borderRadius: 10,
        width: "90%",
        alignItems: "center",
        marginBottom: 15,
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#C5CAE9",
        textAlign: "center",
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: "#ffffff",
        textAlign: "center",
    },
    buttonContainer: {
        alignItems: "center",
        width: "100%",
        marginTop: 20,
    },
    favButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#ff4757",
        alignItems: "center",
        justifyContent: "center",
    },
    favButtonText: {
        color: "#ff4757",
        fontSize: 18,
        fontWeight: "bold",
    },
    lottie: {
        width: 150,
        height: 150,
        position: "absolute",
        bottom: 20, 
    },
    favButtonText: {
        color: "white",
        fontSize: 18,
    },
    closeButton: {
        backgroundColor: "#C5CAE9",
        padding: 12,
        borderRadius: 30,
        width: "60%",
        alignItems: "center",
        margin: 10
    },
    closeButtonText: {
        color: "black",
        fontSize: 18,
    },
    adContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
});

export default DrinkDetailScreen;

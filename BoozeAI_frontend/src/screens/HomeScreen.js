import React, { useState, useEffect } from "react";
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, Modal
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";


const HomeScreen = () => {
    const navigation = useNavigation();
    const [mood, setMood] = useState("");
    const [weather, setWeather] = useState("");
    const [budget, setBudget] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [instructions, setInstructions] = useState("");
    const [loading, setLoading] = useState(false);
    const [drinkSuggestion, setDrinkSuggestion] = useState(null);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const API_URL = "https://boozeai.onrender.com/api/drinks/suggest";

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("token");
                if (!storedToken) {
                    Alert.alert("Session Expired", "Please log in again.");
                    navigation.replace("AuthScreen");
                } else {
                    setToken(storedToken.trim());
                }
            } catch (err) {
                console.error("Error retrieving token:", err);
            }
        };
        fetchToken();
    }, []);

    const getDrinkSuggestion = async () => {
        if (!token || typeof token !== "string") {
            navigation.replace("AuthScreen");
            return;
        }
    
        setLoading(true);
        setError(null);
        setDrinkSuggestion(null);
    
        try {
            const payload = {
                mood,
                weather,
                budget,
                ingredients, 
                instructions,
            };
    
    
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.trim()}`,
                },
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                if (data && typeof data === "object" && data.suggestion && data.id) {
                    setDrinkSuggestion({
                        id: data.id,
                        name: "Suggested Drink",
                        description: data.suggestion,
                    });
                    setModalVisible(true);
                } else {
                    setError("Unexpected response format.");
                    console.error("Unexpected API response:", data);
                }
            } else if (response.status === 401) {
                Alert.alert("Session Expired", "Please log in again.");
                await AsyncStorage.removeItem("token");
                navigation.replace("AuthScreen");
            } else {
                setError(data?.message || "Something went wrong.");
            }
        } catch (err) {
            setError("Failed to fetch suggestion. Please try again.");
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };
    


   
    const formatDescription = (description) => {
        if (!description) return "";

        const parts = description.split(/(\*\*.*?\*\*|##.*?\n|---)/); // Split on **bold**, ## headings, and ---

        return parts.map((part, index) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <Text key={index} style={{ fontWeight: "bold", color: "#F1FAEE" }}>{part.slice(2, -2)}</Text>;
            }
            if (part.startsWith("##")) {
                return <Text key={index} style={{ fontSize: 18, fontWeight: "bold", marginVertical: 5, color: "#A8DADC" }}>{part.replace("##", "").trim()}</Text>;
            }
            if (part === "---") {
                return <View key={index} style={{ borderBottomWidth: 1, borderBottomColor: "#A8DADC", marginVertical: 5 }} />;
            }
            return <Text key={index} style={{ color: "#F1FAEE" }}>{part}</Text>;
        });
    };


    const addToFavourite = async () => {
        if (!drinkSuggestion || !drinkSuggestion.id) {
            alert("Drink ID is missing!");
            console.error("Drink suggestion data:", drinkSuggestion);
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
                alert("Added to Favourites!");
            } else {
                alert(data.error || "Failed to add to favourites");
            }
        } catch (error) {
            console.error("Error adding to favourites:", error);
            alert("Something went wrong!");
        }
    };



    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Find Your Perfect Drink</Text>

                <Text style={styles.label}>Mood</Text>
                <View style={styles.buttonGroup}>
                    {["Happy", "Stressed", "Chill", "Party", "Tired"].map(option => (
                        <TouchableOpacity key={option} style={[styles.selectButton, mood === option && styles.selectedButton]} onPress={() => setMood(option)}>
                            <Text style={styles.selectButtonText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Weather</Text>
                <View style={styles.buttonGroup}>
                    {["Sunny", "Rainy", "Cold", "Warm"].map(option => (
                        <TouchableOpacity key={option} style={[styles.selectButton, weather === option && styles.selectedButton]} onPress={() => setWeather(option)}>
                            <Text style={styles.selectButtonText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Budget</Text>
                <View style={styles.buttonGroup}>
                    {["₹200-500", "₹500-1000", "more"].map(option => (
                        <TouchableOpacity key={option} style={[styles.selectButton, budget === option && styles.selectedButton]} onPress={() => setBudget(option)}>
                            <Text style={styles.selectButtonText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Ingredients</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Add an ingredient"
                        placeholderTextColor="#bbb"
                        value={ingredients}
                        onChangeText={setIngredients}
                    />
                
                

                <Text style={styles.label}>Instructions</Text>
                <TextInput
                    style={styles.input}
                    placeholder="How should it be prepared?"
                    placeholderTextColor="#bbb"
                    value={instructions}
                    onChangeText={setInstructions}
                    multiline
                />

                <TouchableOpacity style={styles.button} onPress={getDrinkSuggestion} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? "Fetching..." : "Get Drink Suggestion"}</Text>
                </TouchableOpacity>
                {loading && (
                    <View style={styles.lottieContainer}>
                        <LottieView
                            source={require("../../assets/loading1.json")}
                            autoPlay
                            loop
                            style={styles.lottie}
                        />
                    </View>
                )}

                {/* Modal for Drink Suggestion */}
                <Modal visible={modalVisible} transparent={true} animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <ScrollView contentContainerStyle={styles.modalScroll}>
                                <Text style={styles.resultTitle}>{drinkSuggestion?.name || "Unknown Drink"}</Text>
                                <Text style={styles.resultDescription}>{formatDescription(drinkSuggestion?.description)}</Text>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.favButton} onPress={addToFavourite}>
                                        <Text style={styles.favButtonText}>❤️ Add to Favourite</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#1C1C3A", padding: 20 },
    container: { alignItems: "center" },
    title: { fontSize: 24, fontWeight: "bold", color: "#D1C4E9", marginBottom: 20 },
    label: { fontSize: 16, fontWeight: "500", color: "#C5CAE9", marginBottom: 8 },
    buttonGroup: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 15 },
    selectButton: {
        backgroundColor: "#3A2E6E",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        margin: 5,
    },
    selectedButton: { backgroundColor: "#5D3FD3" },
    selectButtonText: { color: "#EDE7F6", fontSize: 16 },
    input: {
        width: "100%",
        backgroundColor: "#3A2E6E",
        color: "#EDE7F6",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: "#5D3FD3",
        padding: 12,
        borderRadius: 8,
        marginLeft: 10,
    },
    addButtonText: { fontSize: 18, fontWeight: "bold", color: "#FFFFFF" },
    button: {
        backgroundColor: "#5D3FD3",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        width: "100%",
        marginTop: 20,
    },
    buttonText: { fontSize: 16, fontWeight: "bold", color: "#FFFFFF" },
    ingredient: { color: "#EDE7F6", marginBottom: 5, fontSize: 14 },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "#3A2E6E",
        padding: 20,
        borderRadius: 10,
        width: "85%",
        alignItems: "center",
        maxHeight: 700,
        width: 380
    },
    modalScroll: {
        width: "100%",
        alignItems: "center",
    },
    resultTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#D1C4E9",
        marginBottom: 10,
    },
    resultDescription: {
        fontSize: 16,
        color: "#C5CAE9",
        textAlign: "center",
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 10,
    },
    favButton: {
        backgroundColor: "#5D3FD3",
        padding: 12,
        borderRadius: 8,
    },
    favButtonText: {
        color: "#FFFFFF",
    },
    closeButton: {
        backgroundColor: "#3A2E6E",
        padding: 12,
        borderRadius: 8,
    },
    closeButtonText: {
        color: "#EDE7F6",
    },

    lottieContainer: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -100 }, { translateY: -100 }],
        zIndex: 1000,
        backgroundColor: "rgba(28, 28, 58, 0.6)",
        width: 200,
        height: 200,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 4,
        borderColor: "#D1C4E9",
        shadowColor: "#A8DADC",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
    },


    lottie: {
        width: 200,
        height: 200,
    },




});







export default HomeScreen;

import React, { useState, useEffect } from "react";
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, Modal
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
    const navigation = useNavigation();
    const [mood, setMood] = useState("");
    const [weather, setWeather] = useState("Sunny");
    const [budget, setBudget] = useState("$");
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState("");
    const [instructions, setInstructions] = useState("");
    const [loading, setLoading] = useState(false);
    const [drinkSuggestion, setDrinkSuggestion] = useState(null);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const API_URL = "http://10.0.2.2:5001/api/drinks/suggest";

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
            Alert.alert("Authentication Error", "User token is missing. Please log in again.");
            navigation.replace("AuthScreen");
            return;
        }
    
        setLoading(true);
        setError(null);
        setDrinkSuggestion(null);
    
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.trim()}`,
                },
                body: JSON.stringify({
                    mood,
                    weather,
                    budget,
                    ingredients,
                    instructions,
                }),
            });
    
            const data = await response.json();
            console.log("API Response Data:", data);
    
            if (response.ok) {
                if (data && typeof data === "object" && data.suggestion && data.id) {  // Fix: Check 'id' instead of 'drinkId'
                    setDrinkSuggestion({ 
                        id: data.id, 
                        name: "Suggested Drink",
                        description: data.suggestion 
                    });
                    setModalVisible(true); // Show modal on success
                } else {
                    setError("Unexpected response format.");
                    console.error("Unexpected API response:", data);
                }
            }
             else if (response.status === 401) {
                Alert.alert("Session Expired", "Please log in again.");
                await AsyncStorage.removeItem("token"); // Ensure the token is removed
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
    

    const addIngredient = () => {
        if (newIngredient.trim()) {
            setIngredients((prevIngredients) => [...prevIngredients, newIngredient.trim()]);
            setNewIngredient("");
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
            const response = await fetch("http://10.0.2.2:5001/api/drinks/favourites", {
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
                <View style={styles.fullWidthContainer}>

                    <Text style={styles.label}>Select your mood:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={mood} onValueChange={setMood} style={styles.picker}>
                            {["😊 Happy", "😔 Stressed", "😌 Chill", "🎉 Party", "🥱 Tired"].map((option) => (
                                <Picker.Item key={option} label={option} value={option} />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Weather:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={weather} onValueChange={setWeather} style={styles.picker}>
                            {["Sunny", "Rainy", "Cold", "Warm"].map((option) => (
                                <Picker.Item key={option} label={option} value={option} />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Budget:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={budget} onValueChange={setBudget} style={styles.picker}>
                            {["₹200-500", "₹500-1000", "more"].map((option) => (
                                <Picker.Item key={option} label={option} value={option} />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Ingredients:</Text>
                    <View style={styles.ingredientInputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Add an ingredient..."
                            placeholderTextColor="#F14A00"
                            value={newIngredient}
                            onChangeText={setNewIngredient}
                        />
                    </View>
                    {ingredients.map((ing, index) => (
                        <Text key={index} style={styles.ingredient}>{ing}</Text>
                    ))}

                    <Text style={styles.label}>Instructions:</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="How do you want it prepared?"
                        placeholderTextColor="#F14A00"
                        value={instructions}
                        onChangeText={setInstructions}
                        multiline
                    />

                    <TouchableOpacity style={styles.button} onPress={getDrinkSuggestion} disabled={loading}>
                        <Text style={styles.buttonText}>
                            {loading ? "Fetching..." : "Get AI Drink Suggestion 🍸"}
                        </Text>
                    </TouchableOpacity>

                    {loading && <ActivityIndicator size="large" color="#008080" style={{ marginTop: 10 }} />}
                    {error && <Text style={styles.error}>{error}</Text>}

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

                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#121212" },

    container: { padding: 20, alignItems: "center", backgroundColor: "#121212" },

    label: { fontSize: 16, fontWeight: "bold", marginVertical: 10, color: "#F14A00" },

    pickerContainer: {
        width: "80%",
        borderWidth: 1,
        borderColor: "#500073",
        borderRadius: 10,
        backgroundColor: "#2A004E",
        marginBottom: 10,
        overflow: "hidden",
    },
    picker: { height: 50, width: "100%", color: "#F14A00" },

    ingredientInputContainer: { flexDirection: "row", alignItems: "center", width: "80%" },

    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#500073",
        padding: 10,
        borderRadius: 8,
        color: "#F14A00",
        backgroundColor: "#2A004E",
    },

    addButton: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: "#F14A00",
        borderRadius: 8,
    },
    addButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },

    textArea: {
        width: "80%",
        borderWidth: 1,
        borderColor: "#500073",
        padding: 10,
        borderRadius: 8,
        minHeight: 60,
        textAlignVertical: "top",
        color: "#F14A00",
        backgroundColor: "#2A004E",
    },

    button: {
        marginTop: 20,
        backgroundColor: "#500073",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        width: "80%",
    },
    buttonContainer: {
        flexDirection: "column",  // Stack buttons vertically
        alignItems: "center",     // Center horizontally
        justifyContent: "center", // Center vertically
        marginTop: 20,
        gap: 2,  // Space between buttons
    },
    buttonText: { color: "#F14A00", fontWeight: "bold", fontSize: 16 },

    error: { color: "#E63946", marginTop: 10 },

    fullWidthContainer: {
        flex: 1,
        width: "100%",
        backgroundColor: "#121212",
        alignItems: "center",
        paddingBottom: 20,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "85%",
        maxHeight: "80%",
        backgroundColor: "#1e1e1e",
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 5,
        justifyContent: "center", 
        alignItems: "center",
    },
    modalScroll: {
        paddingBottom: 20,
    },
    resultTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#ffcc00",
        textAlign: "center",
        marginBottom: 10,
    },
    resultDescription: {
        fontSize: 16,
        color: "#ddd",
        marginBottom: 20,
        textAlign: "center",
    },
    favButton: {
        backgroundColor: "#ffcc00",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
        shadowColor: "#ffcc00",
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 5,
        width: "80%",
    },
    favButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#222",
    },
    closeButton: {
        backgroundColor: "#E63946",
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
        width: "80%",
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },

    drinkCard: {
        backgroundColor: "#1E1E1E",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "transparent",
    },
    selectedDrinkCard: {
        borderColor: "#F4A261",
    },
});






export default HomeScreen;

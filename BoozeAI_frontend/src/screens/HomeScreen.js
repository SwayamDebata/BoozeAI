import React, { useState, useEffect } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, Modal, Animated, FlatList
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const HomeScreen = () => {
    const navigation = useNavigation();
    const [mood, setMood] = useState("");
    const [weather, setWeather] = useState("");
    const [budget, setBudget] = useState("");
    const [selectedInstruction, setSelectedInstruction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [drinkSuggestion, setDrinkSuggestion] = useState(null);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [progress] = useState(new Animated.Value(0));
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    const API_URL = "https://boozeai.onrender.com/api/drinks/suggest";

    const moods = [
        { label: "Happy", animation: require("../../assets/happy.json") },
        { label: "Stressed", animation: require("../../assets/stressed.json") },
        { label: "Chill", animation: require("../../assets/chill.json") },
        { label: "Party", animation: require("../../assets/party.json") },
        { label: "Tired", animation: require("../../assets/tired.json") },
    ];

    const weatherOptions = [
        { label: "Sunny", animation: require("../../assets/sunny.json") },
        { label: "Rainy", animation: require("../../assets/rainy.json") },
        { label: "Cold", animation: require("../../assets/cold.json") },
        { label: "Warm", animation: require("../../assets/warm.json") },
    ];
    const budgets = ["₹200-400", "₹400-600", "₹600-1000", "more"];



    const ingredientsList = [
        { label: "Coke", animation: require("../../assets/coke.json") },
        { label: "Lemon", animation: require("../../assets/lemon.json") },
        { label: "Mint", animation: require("../../assets/mint.json") },
        { label: "Soda", animation: require("../../assets/soda.json") },
        { label: "Orange Juice", animation: require("../../assets/orange.json") },
        { label: "Ginger Beer", animation: require("../../assets/ginger.json") },
        { label: "Sugar Syrup", animation: require("../../assets/sugar.json") },
        { label: "Tonic Water", animation: require("../../assets/water.json") },
    ];

    const instructionsList = [
        { label: "Rum", animation: require("../../assets/rum.json") },
        { label: "Whiskey", animation: require("../../assets/whiskey.json") },
        { label: "Beer", animation: require("../../assets/beer.json") },
        { label: "Vodka", animation: require("../../assets/vodka.json") },
        { label: "Gin", animation: require("../../assets/gin.json") },
        { label: "Tequila", animation: require("../../assets/tequila.json") },
    ];


    const toggleIngredient = (ingredient) => {
        setSelectedIngredients((prev) =>
            prev.includes(ingredient)
                ? prev.filter((item) => item !== ingredient)
                : [...prev, ingredient]
        );
    };
    const toggleInstruction = (instruction) => {
        setSelectedInstruction(instruction === selectedInstruction ? null : instruction);
    };



    const AnimatedCard = ({ item, selected, onPress }) => {
        const scaleAnim = new Animated.Value(1);

        const handlePressIn = () => {
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 150,
                useNativeDriver: true,
            }).start();
        };

        const handlePressOut = () => {
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start(onPress);
        };

        return (
            <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }], borderColor: selected ? "#FFD700" : "#444" }]}>
                <TouchableOpacity
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={styles.touchableArea}
                >
                    <LottieView source={item.animation} autoPlay loop style={styles.lottie} />
                </TouchableOpacity>
            </Animated.View>
        );
    };



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
                ingredients: selectedIngredients.join(", "),
                instruction: selectedInstruction,
            };

            console.log("Sending Payload:", JSON.stringify(payload, null, 2));
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

    useEffect(() => {
        Animated.timing(progress, {
            toValue: budgets.indexOf(budget),
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [budget]);



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
                <View style={styles.cardContainer}>
                    {moods.map((item) => (
                        <AnimatedCard
                            key={item.label}
                            item={item}
                            selected={mood === item.label}
                            onPress={() => setMood(item.label)} 
                        />
                    ))}
                </View>

                <Text style={styles.label}>Weather</Text>
                <View style={styles.cardContainer}>
                    {weatherOptions.map((item) => (
                        <AnimatedCard
                            key={item.label}
                            item={item}
                            selected={weather === item.label}
                            onPress={() => setWeather(item.label)} 
                        />
                    ))}
                </View>

                <Text style={styles.label}>Budget</Text>
                <View style={styles.progressBarContainer}>
                    <Animated.View style={[styles.progressBar, {
                        width: progress.interpolate({
                            inputRange: [0, budgets.length - 1],
                            outputRange: ['0%', '100%'],
                        })
                    }]} />
                </View>
                <View style={styles.budgetOptions}>
                    {budgets.map((option, index) => (
                        <TouchableOpacity key={index} style={styles.budgetButton} onPress={() => setBudget(option)}>
                            <View style={[styles.budgetIndicator, budget === option && styles.budgetSelected]} />
                            <Text style={styles.budgetText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Ingredients</Text>
                <FlatList
                    horizontal
                    data={ingredientsList}
                    keyExtractor={(item) => item.label}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.ingredientsContainer}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.ingredientCard, selectedIngredients.includes(item.label) && styles.ingredientSelected]}
                            onPress={() => toggleIngredient(item.label)}
                        >
                            <LottieView source={item.animation} autoPlay loop style={styles.lottieIngredients} />
                            <Text style={styles.ingredientText}>{item.label}</Text>
                        </TouchableOpacity>
                    )}
                />



                <Text style={styles.label}>Instructions</Text>
                <FlatList
                    horizontal
                    data={instructionsList}
                    keyExtractor={(item) => item.label}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.ingredientsContainer}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.ingredientCard, selectedInstruction === item.label && styles.ingredientSelected]}
                            onPress={() => toggleInstruction(item.label)}
                        >
                            <LottieView source={item.animation} autoPlay loop style={styles.lottieIngredients} />
                            <Text style={styles.ingredientText}>{item.label}</Text>
                        </TouchableOpacity>
                    )}
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
    screen: { flex: 1, backgroundColor: "#1C1C3A" },
    title: { fontSize: 22, fontWeight: "bold", color: "#D1C4E9", marginBottom: 15, textAlign: "center" },
    label: { fontSize: 16, fontWeight: "bold", color: "#C5CAE9", marginBottom: 8, textAlign: "center" },
    cardContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 10 },
    card: {
        width: 65,
        height: 70,
        backgroundColor: "#2A2A5A",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        margin: 6,
        borderWidth: 2,
    },
    touchableArea: { alignItems: "center" },
    lottie: { width: 40, height: 40 },
    lottieIngredients: { width: 50, height: 50 },

    progressBarContainer: {
        height: 8,
        backgroundColor: "#3A2A6E",
        borderRadius: 5,
        width: "90%",
        marginBottom: 5,
        marginTop: 10,
        alignSelf: "center",
    },
    progressBar: {
        height: 8,
        backgroundColor: "#FFD700",
        borderRadius: 5,
        padding: 5
    },
    budgetText: {
        color: "#fff"
    },
    budgetOptions: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
    },
    budgetItem: {
        alignItems: "center",
    },
    budgetButton: {
        flex: 1,
        alignItems: "center",
        padding: 10,
    },
    budgetIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#666",
    },
    budgetSelected: {
        backgroundColor: "#FFD700",
    },
    budgetLabel: {
        color: "#C5CAE9",
        fontSize: 12,
        marginTop: 4,
        textAlign: "center",
    },
    ingredientsContainer: { paddingHorizontal: 10 },
    ingredientCard: { width: 110, height: 80, backgroundColor: "#2A2A5A", padding: 10, margin: 8, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    ingredientSelected: { borderRadius:10, borderWidth: 2, borderColor:"#FFD700"},
    ingredientText: { color: "#fff" },
    button: { backgroundColor: "#FFD700", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 20 },
    buttonText: { fontSize: 16, fontWeight: "bold" },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#1C1C3A",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalScroll: {
        alignItems: "center",
    },
    resultTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFD700",
        textAlign: "center",
        marginBottom: 10,
    },
    resultDescription: {
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
    },
    buttonContainer: {
        marginTop: 20,
    },
    favButton: {
        backgroundColor: "#FFD700",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    favButtonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    closeButton: {
        backgroundColor: "#444",
        padding: 10,
        borderRadius: 8,
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
    },

});












export default HomeScreen;

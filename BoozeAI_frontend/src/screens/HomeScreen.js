import React, { useRef, useState, useEffect } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Animated, FlatList, PanResponder, Dimensions, Pressable
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
    const [progress] = useState(new Animated.Value(0));
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [showLottieEffect, setShowLottieEffect] = useState(false);

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
    const screenWidth = Dimensions.get('window').width;



    const ingredientsList = [
        { label: "Coke", animation: require("../../assets/coke.json") },
        { label: "Lemon", animation: require("../../assets/lemon.json") },
        { label: "Mint", animation: require("../../assets/mint.json") },
        { label: "Soda", animation: require("../../assets/soda.json") },
        { label: "Orange Juice", animation: require("../../assets/orange.json") },
        { label: "Ginger Beer", animation: require("../../assets/ginger.json") },
        { label: "Sugar Syrup", animation: require("../../assets/sugar.json") },
        { label: "Tonic Water", animation: require("../../assets/water.json") },
        { label: "coconut water", animation: require("../../assets/coconut.json") },
        { label: "sugarcane", animation: require("../../assets/sugarcane.json") },
        { label: "apple juice", animation: require("../../assets/apple.json") },
        { label: "coffee", animation: require("../../assets/Coffee.json") },
        { label: "chocolate", animation: require("../../assets/Chocolate.json") },
        { label: "grape juice", animation: require("../../assets/grape.json") },
        { label: "pineapple", animation: require("../../assets/Pineapple.json") },
        { label: "mango", animation: require("../../assets/mango.json") },
        { label: "watermelon", animation: require("../../assets/watermelon.json") },
        { label: "redbull", animation: require("../../assets/redbull.json") },
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

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }),
        ]).start();

        setShowLottieEffect(true);
        setTimeout(() => setShowLottieEffect(false), 1000); 

        getDrinkSuggestion(); 
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
                ...(selectedIngredients.length > 0 && { ingredients: selectedIngredients.join(", ") }),
                ...(selectedInstruction && { instruction: selectedInstruction }),
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
                    const newDrinkSuggestion = {
                        id: data.id,
                        name: "Suggested Drink",
                        description: data.suggestion,
                    };

                    setDrinkSuggestion(newDrinkSuggestion);
                    navigation.navigate("DrinkDetail", { drinkSuggestion: newDrinkSuggestion, token: token });
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
    
const DraggableBudgetSlider = ({ budget, setBudget }) => {
    const sliderWidth = screenWidth * 0.85;
    const knobSize = 26;
    const stepWidth = sliderWidth / (budgets.length - 1);

    const panX = useRef(new Animated.Value(0)).current;
    const positionX = useRef(0);

    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    const moveToPosition = (x) => {
        const newPos = clamp(x, 0, sliderWidth);
        const closestIndex = Math.round(newPos / stepWidth);
        const snappedX = closestIndex * stepWidth;

        positionX.current = snappedX;
        setBudget(budgets[closestIndex]);

        Animated.spring(panX, {
            toValue: snappedX,
            useNativeDriver: false,
        }).start();
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                panX.stopAnimation();
            },
            onPanResponderMove: (_, gesture) => {
                const newX = clamp(positionX.current + gesture.dx, 0, sliderWidth);
                panX.setValue(newX);
            },
            onPanResponderRelease: (_, gesture) => {
                moveToPosition(positionX.current + gesture.dx);
            },
        })
    ).current;

    useEffect(() => {
        const index = budgets.indexOf(budget);
        if (index !== -1) {
            const x = index * stepWidth;
            positionX.current = x;
            panX.setValue(x);
        }
    }, [budget]);

    const handleTrackPress = (event) => {
        const { locationX } = event.nativeEvent;
        moveToPosition(locationX);
    };

    return (
        <View style={styles.sliderContainer}>
            <Pressable onPress={handleTrackPress}>
                <View style={[styles.sliderTrack, { width: sliderWidth }]}>
                    <Animated.View
                        style={[
                            styles.sliderFilled,
                            {
                                width: panX,
                            },
                        ]}
                    />
                    <Animated.View
                        {...panResponder.panHandlers}
                        style={[
                            styles.knob,
                            {
                                transform: [{ translateX: panX }],
                            },
                        ]}
                    />
                </View>
            </Pressable>
            <View style={[styles.budgetLabels, { width: sliderWidth }]}>
                {budgets.map((label, index) => (
                    <Text key={label} style={styles.budgetText}>{label}</Text>
                ))}
            </View>
        </View>
    );
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

                <Text style={styles.label}>Drink Price</Text>
                <DraggableBudgetSlider budget={budget} setBudget={setBudget} />


                <Text style={styles.label}>Mix-ins</Text>
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



                <Text style={styles.label}>Core Liquor</Text>
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


                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handlePress}
                        disabled={loading}
                    >
                        {/* Constant sparkle animation */}
                        <LottieView
                            source={require("../../assets/Sparkle.json")}
                            autoPlay
                            loop
                            style={{
                                position: "absolute",
                                top: 2,
                                left: 0,
                                right: 0,
                                height: 40,
                                zIndex: 0, 
                            }}
                        />
                        {/* Button text */}
                        <Text style={[styles.buttonText, { zIndex: 1 }]}>
                            {loading ? "Fetching..." : "Get Drink Suggestion"}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>


                {loading && (
                    <View style={styles.lottieContainer}>
                        <LottieView
                            source={require("../../assets/loading1.json")}
                            autoPlay
                            loop
                            style={styles.lottieLoad}
                        />
                    </View>
                )}
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
    lottieContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(28, 28, 58, 0.9)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    lottieLoad: {
        width: 120,
        height: 120,
    },
    loadingText: {
        fontSize: 18,
        color: "#C5CAE9",
        marginTop: 10,
        textAlign: "center",
        fontWeight: "bold",
    },
    budgetText: {
        color: "#fff"
    },
    ingredientsContainer: { paddingHorizontal: 10, marginBottom: 10 },
    ingredientCard: { width: 110, height: 80, backgroundColor: "#2A2A5A", padding: 10, margin: 8, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    ingredientSelected: { borderRadius: 10, borderWidth: 2, borderColor: "#FFD700" },
    ingredientText: { color: "#fff" },
    button: {
        backgroundColor: "#FFD700",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
        width: "90%",
        alignSelf: "center",
        elevation: 4,
        shadowColor: "#FFD700",
        shadowOpacity: 0.6,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        position: "relative",
    },
    buttonText: { fontSize: 16, fontWeight: "bold" },
    sliderContainer: {
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15,
    },
    sliderTrack: {
        height: 6,
        backgroundColor: '#444A88',
        borderRadius: 3,
        position: 'relative',
        justifyContent: 'center',
    },
    sliderFilled: {
        height: 6,
        backgroundColor: '#FFD700',
        borderRadius: 3,
        position: 'absolute',
        left: 0,
        top: 0,
    },
    knob: {
        position: 'absolute',
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#FFD700',
        borderWidth: 2,
        borderColor: '#1C1C3A',
        top: -10,
        zIndex: 10,
    },

    budgetLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 10,
    },
});












export default HomeScreen;

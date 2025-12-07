import React, { useRef, useState, useEffect } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Animated, FlatList, PanResponder, Dimensions, Pressable
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import mobileAds, { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";
import { map, filter } from "rxjs/operators";
import { Vibration } from "react-native";

mobileAds()
  .initialize()
  .then(adapterStatuses => {
    console.log('Initialization complete!');
  });

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-4693002133615714/2890652520';

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
    const [interstitials, setInterstitials] = useState(null);
    const interstitialLoadedRef = useRef(false);
    const lastShake = useRef(0);
    const shakeTextAnim = useRef(new Animated.Value(1)).current;

    const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
        keywords: ['drinks', 'beverages', 'cocktails', 'alcohol', 'soft drinks', 'juice', 'smoothies', 'mocktails', 'beer', 'wine', 
  'spirits', 'whiskey', 'tequila', 'rum', 'vodka', 'wine pairing', 'recipes', 'snacks', 'appetizers', 'desserts', 
  'fast food', 'vegetarian', 'vegan', 'gluten-free', 'organic food', 'healthy eating', 'street food', 'gourmet', 
  'dining out', 'cooking', 'clothing', 'streetwear', 'shoes', 'accessories', 'fashion trends', 'summer fashion', 
  'winter fashion', 'outfit ideas', 'fashionistas', 'designer brands', 'luxury fashion', 'vintage clothing', 
  'sustainable fashion', 'fashion tips', 'gaming', 'video games', 'esports', 'online games', 'console gaming', 
  'pc gaming', 'mobile games', 'action games', 'adventure games', 'role-playing games', 'puzzle games', 'strategy games', 
  'multiplayer games', 'game reviews', 'fitness', 'health', 'travel', 'beauty', 'self-care', 'meditation', 'yoga', 'wellness', 
  'adventure', 'hiking', 'photography', 'gadgets', 'tech news', 'smartphones', 'laptops', 'software', 'artificial intelligence', 
  'virtual reality', 'augmented reality', 'tech trends', 'startups', 'web development'],
    });
    const API_URL = "https://boozeai.onrender.com/api/drinks/suggest";

    const moods = [
        { label: "Happy", animation: require("../../assets/happy.json") },
        { label: "Stressed", animation: require("../../assets/stressed.json") },
        { label: "Chill", animation: require("../../assets/chill.json") },
        { label: "Party", animation: require("../../assets/party.json") },
        { label: "Tired", animation: require("../../assets/tired.json") },
        { label: "Nostalgic", animation: require("../../assets/nostalgic.json") },
        { label: "Breakup", animation: require("../../assets/broken.json") },
        { label: "Romantic Date", animation: require("../../assets/date.json") },
    ];

    const weatherOptions = [
        { label: "Sunny", animation: require("../../assets/sunny.json") },
        { label: "Rainy", animation: require("../../assets/rainy.json") },
        { label: "Cold", animation: require("../../assets/cold.json") },
        { label: "Warm", animation: require("../../assets/warm.json") },
    ];
    const budgets = ["₹200-400", "₹400-600", "₹600-1000", "₹1000 & above"];
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
        { label: "rose syrup", animation: require("../../assets/rose.json") },
    ];

    const instructionsList = [
        { label: "Rum", animation: require("../../assets/rum.json") },
        { label: "Whiskey", animation: require("../../assets/whiskey.json") },
        { label: "Beer", animation: require("../../assets/beer.json") },
        { label: "Vodka", animation: require("../../assets/vodka.json") },
        { label: "Gin", animation: require("../../assets/gin.json") },
        { label: "Tequila", animation: require("../../assets/tequila.json") },
        { label: "Brandy", animation: require("../../assets/brandy.json") },
        { label: "Bourbon", animation: require("../../assets/bourbon.json") },
        { label: "Wine", animation: require("../../assets/wine.json") },
        { label: "Breezer", animation: require("../../assets/breezer.json") },
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

    const loadNewInterstitial = () => {
        const newAd = InterstitialAd.createForAdRequest(adUnitId, {
            requestNonPersonalizedAdsOnly: true,
        });
    
        const adLoadPromise = new Promise((resolve) => {
            const onLoaded = newAd.addAdEventListener(AdEventType.LOADED, () => {
                interstitialLoadedRef.current = true;
                resolve();
                onLoaded();
            });
    
            const onClosed = newAd.addAdEventListener(AdEventType.CLOSED, () => {
                interstitialLoadedRef.current = false;
                loadNewInterstitial(); 
                onClosed(); 
            });
        });
    
        newAd.load();
        newAd._adLoadPromise = adLoadPromise;
    
        setInterstitials(newAd);
    };
    
    useEffect(() => {
        loadNewInterstitial();
        return () => {
            if (interstitials) {
                interstitials.removeAllListeners();
            }
        };
    }, []);
    
    useEffect(() => {
        // Shake Text Pulse Animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(shakeTextAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
                Animated.timing(shakeTextAnim, { toValue: 1, duration: 800, useNativeDriver: true })
            ])
        ).start();

        // Sensor Subscription
        try {
            setUpdateIntervalForType(SensorTypes.accelerometer, 400); // moderate check
            const subscription = accelerometer
                .pipe(
                    map(({ x, y, z }) => Math.sqrt(x * x + y * y + z * z)),
                    filter(speed => speed > 25) // Shake threshold
                )
                .subscribe(
                    speed => {
                        const now = Date.now();
                        if (now - lastShake.current > 3000) { // 3s cooldown
                            lastShake.current = now;
                            handleShake();
                        }
                    },
                    error => {
                        console.log("Sensor subscription error:", error);
                    }
                );

            return () => {
                subscription && subscription.unsubscribe();
            };
        } catch (e) {
            console.log("Sensors not available (requires rebuild):", e);
            // Fallback or do nothing - feature just won't work until rebuild
        }
    }, []);

    const localDrinks = [
        { 
            id: "l1", 
            name: "The Galaxy Walker", 
            suggestion: `Cocktail Name: The Galaxy Walker\nMood: Party\nWeather: Clear\nIngredients:\n60ml Vodka\n30ml Blue Curacao\nLemonade\nEdible Gold Dust\nInstructions:\n1. Fill a glass with ice.\n2. Pour vodka and blue curacao.\n3. Top with lemonade and stir gently.\n4. Sprinkle gold dust for a cosmic effect.\nBudget: ₹600-1000`
        },
        { 
            id: "l2", 
            name: "Sunset Overdrive", 
            suggestion: `Cocktail Name: Sunset Overdrive\nMood: Chill\nWeather: Warm\nIngredients:\n45ml Tequila\n90ml Orange Juice\nSplash of Grenadine\nCherry for garnish\nInstructions:\n1. Pour tequila and orange juice into an ice-filled glass.\n2. Slowly pour grenadine down the side to create a sunset gradient.\n3. Garnish with a cherry.\nBudget: ₹400-600`
        },
        { 
            id: "l3", 
            name: "Midnight Mule", 
            suggestion: `Cocktail Name: Midnight Mule\nMood: Nostalgic\nWeather: Cool\nIngredients:\n60ml Dark Rum\n15ml Lime Juice\nGinger Beer\nMint leaves\nInstructions:\n1. Squeeze lime into a copper mug.\n2. Add ice and dark rum.\n3. Top with ginger beer and stir.\n4. Garnish with fresh mint.\nBudget: ₹400-600`
        },
        { 
            id: "l4", 
            name: "Electric Lemonade", 
            suggestion: `Cocktail Name: Electric Lemonade\nMood: Energetic\nWeather: Sunny\nIngredients:\n45ml Gin\n30ml Blue Curacao\nSour Mix\nLemon-Lime Soda\nInstructions:\n1. Shake gin, blue curacao, and sour mix with ice.\n2. Strain into a glass.\n3. Top with soda and garnish with a lemon wheel.\nBudget: ₹400-600`
        },
        { 
            id: "l5", 
            name: "Spicy Señorita", 
            suggestion: `Cocktail Name: Spicy Señorita\nMood: Bold\nWeather: Hot\nIngredients:\n60ml Tequila\n2 Jalapeño slices\n30ml Grapefruit Juice\nSoda Water\nChili Salt\nInstructions:\n1. Rim glass with chili salt.\n2. Muddle jalapeños in shaker.\n3. Add tequila, juice, and ice. Shake well.\n4. Strain over fresh ice and top with soda.\nBudget: ₹600-1000`
        },
        { 
            id: "l6", 
            name: "Velvet Espresso", 
            suggestion: `Cocktail Name: Velvet Espresso\nMood: Tired\nWeather: Rainy\nIngredients:\n45ml Vodka\n30ml Coffee Liqueur\n1 shot Espresso\n3 Coffee Beans\nInstructions:\n1. Brew espresso and let it cool slightly.\n2. Shake all liquid ingredients vigorously with ice.\n3. Strain into a chilled martini glass.\n4. Garnish with coffee beans.\nBudget: ₹600-1000`
        },
        {
            id: "l7",
            name: "Ocean Breeze",
            suggestion: `Cocktail Name: Ocean Breeze\nMood: Chill\nWeather: Sunny\nIngredients:\n60ml White Rum\n30ml Blue Curacao\nPineapple Juice\nLime Juice\nInstructions:\n1. Fill a glass with ice.\n2. Pour rum and Blue Curacao.\n3. Top with pineapple juice and a splash of lime.\n4. Garnish with a pineapple wedge.\nBudget: ₹400-600`
        },
        {
            id: "l8",
            name: "Cherry Bomb",
            suggestion: `Cocktail Name: Cherry Bomb\nMood: Party\nWeather: Night\nIngredients:\n60ml Bourbon\n15ml Cherry Liqueur\nCola\nMaraschino Cherry\nInstructions:\n1. Fill a tall glass with ice.\n2. Pour bourbon and cherry liqueur.\n3. Top with cola.\n4. Garnish with a cherry.\nBudget: ₹600-1000`
        },
        {
            id: "l9",
            name: "Golden Hour",
            suggestion: `Cocktail Name: Golden Hour\nMood: Romantic\nWeather: Sunset\nIngredients:\n60ml Aperol\n90ml Prosecco\nSplash of Soda Water\nOrange Slice\nInstructions:\n1. Fill a wine glass with ice.\n2. Pour Prosecco, then Aperol.\n3. Add a splash of soda water.\n4. Garnish with an orange slice.\nBudget: ₹1000-10000`
        },
        {
            id: "l10",
            name: "Mint Julep",
            suggestion: `Cocktail Name: Mint Julep\nMood: Classy\nWeather: Hot\nIngredients:\n60ml Bourbon\nFresh Mint Leaves\n1 Sugar Cube\nCrushed Ice\nInstructions:\n1. Muddle mint and sugar in a cup.\n2. Fill with crushed ice.\n3. Pour bourbon over the ice.\n4. Stir until the cup frosts.\nBudget: ₹600-1000`
        },
         {
            id: "l11",
            name: "Tropical Storm",
            suggestion: `Cocktail Name: Tropical Storm\nMood: Adventurous\nWeather: Stormy\nIngredients:\n60ml Dark Rum\n60ml Pineapple Juice\n30ml Orange Juice\nSplash of Grenadine\nInstructions:\n1. Shake all ingredients with ice.\n2. Strain into a glass filled with fresh ice.\n3. Garnish with an orange slice and cherry.\nBudget: ₹400-600`
        },
        {
            id: "l12",
            name: "Lavender Haze",
            suggestion: `Cocktail Name: Lavender Haze\nMood: Relaxed\nWeather: Spring\nIngredients:\n45ml Gin\n15ml Lavender Syrup\n30ml Lemon Juice\nSoda Water\nInstructions:\n1. Shake gin, lemon juice, and syrup with ice.\n2. Strain into a glass with ice.\n3. Top with soda water.\n4. Garnish with a lavender sprig.\nBudget: ₹600-1000`
        }
    ];

    const handleShake = () => {
        Vibration.vibrate(100); // Haptic feedback
        // Randomize Selections for UI effect
        const rMood = moods[Math.floor(Math.random() * moods.length)].label;
        const rWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)].label;
        const rBudget = budgets[Math.floor(Math.random() * budgets.length)];

        // Update UI
        setMood(rMood);
        setWeather(rWeather);
        setBudget(rBudget);

        // Pick a random local drink
        const randomDrink = localDrinks[Math.floor(Math.random() * localDrinks.length)];
        
        // Construct the drink object matching API format
        const suggestionObj = {
            id: randomDrink.id,
            name: randomDrink.name,
            description: randomDrink.suggestion
        };

        setDrinkSuggestion(suggestionObj);
        
        // Navigate immediately with the local data
        navigation.navigate("DrinkDetail", { drinkSuggestion: suggestionObj, token: token });
    };

    const getDrinkSuggestion = async (overrides = {}) => {
        if (!token || typeof token !== "string") {
            navigation.replace("Auth");
            return;
        }

        setLoading(true);
        setError(null);
        setDrinkSuggestion(null);

        try {
            await interstitials?._adLoadPromise;

            if (interstitialLoadedRef.current) {
                await interstitials.show();
            } else {
                console.warn("Interstitial not loaded. Skipping ad.");
            }

            const payload = {
                mood: overrides.mood || mood,
                weather: overrides.weather || weather,
                budget: overrides.budget || budget,
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
            <ScrollView 
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Find Your Perfect Drink</Text>
                
                <Animated.View style={{ transform: [{ scale: shakeTextAnim }], alignItems: 'center', marginBottom: 20 }}>
                     <View style={styles.shakeBadge}>
                        <Text style={styles.shakeText}>Shake phone for a surprise! 🎲</Text>
                     </View>
                </Animated.View>

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
    container: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 50,
    },
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
    shakeBadge: {
        backgroundColor: 'rgba(255, 215, 0, 0.15)', // Gold with opacity
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFD700'
    },
    shakeText: {
        color: '#FFD700',
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 0.5
    }
});












export default HomeScreen;

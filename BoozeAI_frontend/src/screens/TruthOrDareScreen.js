import React, { useState, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, TextInput, Image, ScrollView, Easing } from "react-native";
import LottieView from "lottie-react-native";
import { useFocusEffect } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import homeIcon from "../../assets/beer.png"; // Bottle image

const truths = [
  "What is your most embarrassing moment?",
  "Have you ever lied to your best friend?",
  "What's a secret you’ve never told anyone?",
  "Who was your first crush?",
  "What's the last thing you Googled?",
  "Have you ever stalked someone on Instagram?",
  "What's a food you pretend to like but secretly hate?",
  "What was your most awkward school moment?",
  "Have you ever had a crush on a teacher?",
  "What's your guilty pleasure song?",
  "If you had to marry one celebrity, who would it be?",
  "What’s the most childish thing you still do?",
  "What’s your biggest fear?",
  "What lie have you told that you still feel bad about?",
  "What’s your weirdest habit?",
  "Have you ever peed in a pool?",
  "Who is your favorite family member?",
  "What is the grossest thing you've ever eaten?",
  "Have you ever cheated on a test?",
  "What is a rumor that you started?"
];

const dares = [
  "Do 10 push-ups right now!",
  "Dance like crazy for 30 seconds!",
  "Sing a song loudly!",
  "Text someone random 'I love paneer!'",
  "Do a silly face selfie!",
  "Speak in a movie villain voice for the next 2 minutes.",
  "Call a friend and confess that you love golgappa more than them.",
  "Send a voice note singing your favorite Bollywood song.",
  "Do a reel-style dance and record it.",
  "Try to touch your toes for 15 seconds.",
  "Say the alphabet backward out loud.",
  "Imitate your favorite teacher or boss.",
  "Do a 15-second stand-up comedy on your last date/crush.",
  "Show the last 5 photos in your gallery.",
  "Balance a book on your head for 30 seconds.",
  "Let the group DM someone from your Instagram.",
  "Talk without using the letter 'a' for the next 1 minute.",
  "Do a filmy proposal to someone in the room.",
  "Eat a spoonful of plain spices (if available).",
  "Hold an ice cube in your hand until it melts."
];

const nhie = [
  "Never have I ever ghosted someone.",
  "Never have I ever lied about my age.",
  "Never have I ever faked being sick.",
  "Never have I ever used someone else's toothbrush.",
  "Never have I ever stalked an ex.",
  "Never have I ever dropped my phone on my face.",
  "Never have I ever peed in the shower.",
  "Never have I ever eaten food from the trash.",
  "Never have I ever forgotten a friend's birthday.",
  "Never have I ever blamed a fart on the dog."
];

export default function TruthOrDareScreen() {
  const [playerCount, setPlayerCount] = useState("");
  const [playerMode, setPlayerMode] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [result, setResult] = useState("");
  const [spun, setSpun] = useState(false);
  const [mode, setMode] = useState('TOD'); // 'TOD' (TruthOrDare) or 'NHIE' (NeverHaveIEver)
  const [nhieStatement, setNhieStatement] = useState("");

  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const totalRotation = useRef(0);

  // Auto-reset when tab is focused if needed, or just provide manual reset.
  // User asked "everytime i go the tab, it should be resetable". 
  // We'll provide a clear 'Reset' action in the UI rather than wiping state unexpectedly.

  const handleStartGame = () => {
    if (parseInt(playerCount) >= 2) {
      setPlayerMode(true);
      setMode('TOD');
    }
  };

  const handleBack = () => {
    setPlayerMode(false);
    setPlayerCount("");
    setResult("");
    setSpun(false);
    setSelectedPlayer(null);
    setNhieStatement("");
    // Reset rotation visually
    spinAnim.setValue(0);
    totalRotation.current = 0;
  };

  const spinBottle = () => {
    const fullSpins = Math.floor(Math.random() * 3 + 3) * 360; // Min 3 spins
    const randomOffset = Math.floor(Math.random() * 360);
    const totalSpin = fullSpins + randomOffset;

    setSpun(false);
    setResult("");
    setSelectedPlayer(null);

    totalRotation.current += totalSpin;

    Animated.timing(spinAnim, {
      toValue: totalRotation.current,
      duration: 2000,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease), // Corrected Easing usage
    }).start(() => {
      const normalizedRotation = totalRotation.current % 360;
      const segmentAngle = 360 / parseInt(playerCount);
      // Determine player based on closest angle (offset by half segment)
      const effectiveRotation = (normalizedRotation + segmentAngle / 2) % 360;
      const playerIndex = Math.floor(effectiveRotation / segmentAngle);
      setSelectedPlayer(playerIndex + 1); 
      setSpun(true);
    });
  };

  const handlePress = (type) => {
    const list = type === "Truth" ? truths : dares;
    const randomItem = list[Math.floor(Math.random() * list.length)];
    setResult(`${type}: ${randomItem}`);

    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const generateNHIE = () => {
    const randomItem = nhie[Math.floor(Math.random() * nhie.length)];
    setNhieStatement(randomItem);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  if (!playerMode) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Game Night</Text>
            <Text style={styles.headerSubtitle}>Spice up the party!</Text>
        </View>

        <View style={styles.cardContainer}>
            <Text style={styles.subHeading}>Enter Players</Text>
            <View style={styles.inputContainer}>
                <Image source={require("../../assets/enter.png")} style={{width: 24, height: 24, marginRight: 10, tintColor: '#8e44ad'}} />
                <TextInput
                style={styles.input}
                placeholder="2-10"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={playerCount}
                onChangeText={setPlayerCount}
                maxLength={2}
                />
            </View>

            <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                <Text style={styles.buttonText}>Start Truth or Dare</Text>
                <Image source={require("../../assets/start.png")} style={{width: 20, height: 20, tintColor: '#fff'}} />
            </TouchableOpacity>

            <View style={styles.divider}>
                 <Text style={styles.dividerText}>OR</Text>
            </View>

            <TouchableOpacity style={[styles.startButton, styles.nhieButton]} onPress={() => { setPlayerMode(true); setMode('NHIE'); }}>
                <Text style={styles.buttonText}>Never Have I Ever</Text>
                <Image source={require("../../assets/brave.png")} style={{width: 20, height: 20, tintColor: '#fff'}} />
            </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.gameContainer} showsVerticalScrollIndicator={false}>
       <View style={styles.topBar}>
           <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Image source={require("../../assets/exit.png")} style={{width: 24, height: 24, tintColor: '#fff'}} />
                <Text style={styles.backText}>Exit</Text>
           </TouchableOpacity>
           <View style={styles.modeBadge}>
               <Text style={styles.modeText}>{mode === 'TOD' ? 'Truth or Dare' : 'Never Have I Ever'}</Text>
           </View>
       </View>

      {mode === 'TOD' ? (
        <>
            <View style={styles.bottleWrapper}>
                {/* Compass / Player Indicators */}
                {[...Array(parseInt(playerCount))].map((_, index) => {
                    const angle = (360 / parseInt(playerCount)) * index;
                    const radius = 140; // Distance from center
                    const x = radius * Math.sin((angle * Math.PI) / 180);
                    const y = -radius * Math.cos((angle * Math.PI) / 180);

                    return (
                        <View key={index} style={[styles.playerIndicator, { transform: [{ translateX: x }, { translateY: y }] }]}>
                            <Text style={styles.playerIndicatorText}>{index + 1}</Text>
                        </View>
                    );
                })}
                
                <Animated.Image
                source={homeIcon}
                style={[styles.bottle, { transform: [{ rotate: spin }] }]}
                resizeMode="contain"
                />
            </View>

            <Text style={styles.instructionText}>
                {spun && selectedPlayer 
                    ? `🎯 Player ${selectedPlayer}, make your choice!` 
                    : "Tap Spin to choose a victim..."}
            </Text>

            <TouchableOpacity style={styles.spinButton} onPress={spinBottle} disabled={!spun && selectedPlayer}>
                <Image source={require("../../assets/whiskey.png")} style={{width: 24, height: 24, marginRight: 8}} />
                <Text style={styles.spinButtonText}>{spun ? "Spin Again" : "Spin the Bottle"}</Text>
            </TouchableOpacity>

            {spun && (
                <View style={styles.choiceContainer}>
                    <TouchableOpacity style={[styles.choiceBtn, styles.truthBtn]} onPress={() => handlePress("Truth")}>
                         <Image source={require("../../assets/swear.png")} style={{width: 32, height: 32, marginBottom: 5, tintColor: '#fff'}} />
                         <Text style={styles.choiceText}>Truth</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.choiceBtn, styles.dareBtn]} onPress={() => handlePress("Dare")}>
                         <Image source={require("../../assets/dare.png")} style={{width: 32, height: 32, marginBottom: 5, tintColor: '#fff'}} />
                         <Text style={styles.choiceText}>Dare</Text>
                    </TouchableOpacity>
                </View>
            )}

             {result !== "" && (
                <Animated.View style={[styles.resultCard, { opacity: fadeAnim }]}>
                    <Text style={styles.resultType}>{result.split(':')[0]}</Text>
                    <Text style={styles.resultContent}>{result.split(':')[1]}</Text>
                </Animated.View>
            )}
        </>
      ) : (
           <View style={styles.nhieContainer}>
                <LottieView source={require("../../assets/guydrinking.json")} autoPlay loop style={{width: 150, height: 150, marginBottom: 10}} />
                <Text style={styles.nhieTitle}>Never Have I Ever...</Text>
               
               {nhieStatement ? (
                   <Animated.View style={[styles.nhieCard, { opacity: fadeAnim }]}>
                       <Text style={styles.nhieText}>{nhieStatement}</Text>
                   </Animated.View>
               ) : (
                   <Text style={styles.placeholderText}>Tap below to reveal a statement!</Text>
               )}

                <TouchableOpacity style={styles.nextButton} onPress={generateNHIE}>
                    <Text style={[styles.buttonText, {color: '#333'}]}>Next Statement</Text>
                    <Image source={require("../../assets/drink.png")} style={{width: 24, height: 24, tintColor: '#333'}} />
                </TouchableOpacity>

                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                    <Image source={require("../../assets/never.png")} style={{width: 24, height: 24, marginRight: 8, tintColor: '#BA2F1F'}} />
                    <Text style={styles.ruleText}>If you've done it, drink!</Text>
                </View>
          </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16162c",
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
      alignItems: 'center',
      marginBottom: 40,
  },
  headerTitle: {
      fontSize: 42,
      fontWeight: '800',
      color: '#fff',
      letterSpacing: 1,
      marginBottom: 5
  },
  headerSubtitle: {
      fontSize: 18,
      color: '#8e44ad',
      fontWeight: '600',
      letterSpacing: 2
  },
  cardContainer: {
    backgroundColor: '#1E1E30',
    padding: 25,
    borderRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#3D3D64'
  },
  subHeading: {
      color: '#B0B0B0',
      fontSize: 16,
      marginBottom: 10,
      fontWeight: '600'
  },
  inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#252542',
      borderRadius: 12,
      paddingHorizontal: 15,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#3D3D64'
  },
  input: {
      flex: 1,
      height: 50,
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
  },
  startButton: {
      backgroundColor: '#8e44ad',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 16,
      borderRadius: 12,
      marginBottom: 10
  },
  nhieButton: {
      backgroundColor: '#FF6F61',
  },
  buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginRight: 8
  },
  divider: {
      alignItems: 'center',
      marginVertical: 15
  },
  dividerText: {
      color: '#666',
      fontWeight: 'bold'
  },
  // Game Styles
  gameContainer: {
      flexGrow: 1,
      backgroundColor: "#16162c",
      paddingTop: 50,
      paddingHorizontal: 20,
      alignItems: 'center',
      paddingBottom: 40 // Add padding for scroll
  },
  topBar: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 30
  },
  backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.1)',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20
  },
  backText: {
      color: '#fff',
      marginLeft: 4,
      fontWeight: '600'
  },
  modeBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#2A2A5A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3D3D64'
  },
  modeText: {
      color: '#D1C4E9',
      fontSize: 12,
      fontWeight: '800',
      textTransform: 'uppercase'
  },
  bottleWrapper: {
      height: 320, // Increased height for compass
      width: 320,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      position: 'relative' // Needed for absolute positioning of indicators
  },
  playerIndicator: {
      position: 'absolute',
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#2A2A5A',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#FFD700',
      elevation: 5
  },
  playerIndicatorText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16
  },
  bottle: {
      width: 120,
      height: 240, 
  },
  instructionText: {
      color: '#B0B0B0',
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center'
  },
  spinButton: {
      backgroundColor: '#FFD700',
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 30,
      marginBottom: 30,
      elevation: 5,
      flexDirection: 'row',
      alignItems: 'center'
  },
  spinButtonText: {
      color: '#000',
      fontSize: 18,
      fontWeight: '900',
      textTransform: 'uppercase'
  },
  choiceContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      marginBottom: 20
  },
  choiceBtn: {
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 15,
      minWidth: 120,
      alignItems: 'center'
  },
  truthBtn: {
      backgroundColor: '#8e44ad'
  },
  dareBtn: {
      backgroundColor: '#E94560'
  },
  choiceText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
  },
  resultCard: {
      backgroundColor: '#1E1E30',
      width: '100%',
      padding: 20,
      borderRadius: 16,
      borderLeftWidth: 5,
      borderLeftColor: '#FFD700',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: '30%',
      zIndex: 20,
      elevation: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      width: '90%', // Ensure it fits but has width
      alignSelf: 'center'
  },
  resultType: {
      color: '#FFD700',
      fontSize: 14,
      fontWeight: '900',
      textTransform: 'uppercase',
      marginBottom: 5,
      textAlign: 'center'
  },
  resultContent: {
      color: '#fff',
      fontSize: 22, // Slightly larger text
      lineHeight: 30,
      fontWeight: '500',
      textAlign: 'center' // Center text
  },
  // NHIE Styles
  nhieContainer: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 100
  },
  nhieTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: '#fff',
      marginBottom: 30,
      textAlign: 'center'
  },
  nhieCard: {
    backgroundColor: '#FF6F61',
    width: '100%',
    padding: 30,
    borderRadius: 20,
    marginBottom: 40,
    alignItems: 'center',
    shadowColor: "#FF6F61",
    shadowOffset: {
        width: 0,
        height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  nhieText: {
      fontSize: 24,
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: 32
  },
  placeholderText: {
      color: '#666',
      fontSize: 16,
      marginBottom: 40,
      fontStyle: 'italic'
  },
  nextButton: {
      backgroundColor: '#fff',
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 30,
      flexDirection: 'row',
      alignItems: 'center'
  },
  ruleText: {
      color: '#BA2F1F', // Darker Red for warning/instruction
      fontWeight: 'bold',
      fontSize: 14
  }
});
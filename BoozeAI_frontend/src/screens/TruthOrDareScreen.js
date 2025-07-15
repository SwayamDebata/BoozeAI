import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from "react-native";
import homeIcon from "../../assets/beer.png"; // Replace with bottle image

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
  "Have you ever faked a sick day to avoid school or work?",
  "If you had to marry one celebrity, who would it be?",
  "What’s the most childish thing you still do?",
  "Have you ever sent a message to the wrong person?",
  "What’s your biggest fear?",
  "What lie have you told that you still feel bad about?",
  "What’s the worst gift you’ve ever received?",
  "What’s your weirdest habit?",
  "What’s the dumbest thing you believed as a kid?",
  "Have you ever pretended to like someone to be polite?"
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
  "Do a reel-style dance and record it (but you don't have to post it 😅).",
  "Try to touch your toes for 15 seconds.",
  "Say the alphabet backward out loud.",
  "Imitate your favorite teacher or boss.",
  "Do a 15-second stand-up comedy on your last date/crush.",
  "Show the last 5 photos in your gallery.",
  "Balance a book on your head for 30 seconds.",
  "Make up a new nickname for yourself.",
  "Pretend to order food on the phone using a weird accent.",
  "Try to rap like Honey Singh for 20 seconds.",
  "Talk without using the letter 'a' for the next 1 minute.",
  "Do a filmy proposal to someone in the room (or to the camera)."
];


export default function TruthOrDareScreen() {
  const [result, setResult] = useState("");
  const [spun, setSpun] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const totalRotation = useRef(0); 
  const spinBottle = () => {
  const fullSpins = Math.floor(Math.random() * 3 + 3) * 360; 
  const randomOffset = Math.floor(Math.random() * 360);
  const totalSpin = fullSpins + randomOffset;

  setSpun(false);
  setResult("");

  totalRotation.current += totalSpin;

  Animated.timing(spinAnim, {
    toValue: totalRotation.current,
    duration: 2000,
    useNativeDriver: true,
  }).start(() => {
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
      useNativeDriver: true
    }).start();
  };

  const spin = Animated.modulo(spinAnim, 360).interpolate({
  inputRange: [0, 360],
  outputRange: ['0deg', '360deg'],
});


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Spin the Bottle</Text>

      {/* Centered Bottle Spinner */}
      <View style={styles.bottleWrapper}>
        <Animated.Image
          source={homeIcon}
          style={[styles.bottle, { transform: [{ rotate: spin }] }]}
        />
      </View>

      {/* Spin Button */}
      <TouchableOpacity style={styles.spinButton} onPress={spinBottle}>
        <Text style={styles.buttonText}>Spin the Bottle</Text>
      </TouchableOpacity>

      {/* Truth & Dare Buttons */}
      {spun && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.truth]} onPress={() => handlePress("Truth")}>
            <Text style={styles.buttonText}>Truth</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.dare]} onPress={() => handlePress("Dare")}>
            <Text style={styles.buttonText}>Dare</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Result Card */}
      {result !== "" && (
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.resultText}>{result}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C3A",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  heading: {
    fontSize: 28,
    color: "#D1C4E9",
    marginBottom: 20,
    fontWeight: "bold",
  },
  bottleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottle: {
    width: 160,
    height: 160,
    marginBottom: 10,
  },
  spinButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 30,
    elevation: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  truth: {
    backgroundColor: "#6A1B9A",
  },
  dare: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    width: "100%",
  },
  resultText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "500",
  },
});

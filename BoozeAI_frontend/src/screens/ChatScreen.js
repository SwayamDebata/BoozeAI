import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { CometChatMessageList } from "@cometchat/chat-uikit-react-native";

const ChatScreen = () => {
  const [loading, setLoading] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null); // User object to chat with
  const [chatUser, setChatUser] = useState(null); // Logged-in current user

  const handleStartChat = async () => {
    try {
      setLoading(true);
  
      // Step 1: Call your backend to create an anonymous user & join queue
      const response = await fetch("http://10.0.2.2:5001/api/anonymous-chat/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
  
      // Read the response body as text, then parse the JSON
      const text = await response.text();
      console.log('Response Text:', text); // log the raw text to check the response content
      
      const data = JSON.parse(text); // Manually parse the response
  
      console.log('Parsed Data:', data); // log the parsed data
  
      if (data.status === "matched") {
        const currentUser = { uid: data.userId, name: data.username };
        const match = { uid: data.partnerId, name: "Anonymous Partner" }; // You may want to get the partner's name too
  
        // Step 2: Log in the current user
        await CometChat.login(currentUser.uid);
        console.log("Logged in as:", currentUser.uid);
  
        // Step 3: Set chat participants
        setChatUser(currentUser);
        setMatchedUser(match);
      } else {
        alert("Waiting for a match...");
      }
    } catch (error) {
      console.error("Chat init failed:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      {!chatUser || !matchedUser ? (
        <>
          <Button
            title="Start Chat"
            onPress={handleStartChat}
            color="#8e44ad"
            disabled={loading}
          />
          {loading && <ActivityIndicator size="large" color="#8e44ad" />}
        </>
      ) : (
        <>
          <Text style={styles.matchText}>
            You're matched with: {matchedUser.name}
          </Text>
          <CometChatMessageList user={matchedUser} />
        </>
      )}
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C3A",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  matchText: {
    fontSize: 18,
    color: "#D1C4E9",
    marginBottom: 10,
  },
});

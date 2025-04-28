/**
 * @format
 */

import React, { useEffect } from "react";
import { AppRegistry, Platform, PermissionsAndroid } from "react-native";
import App from "./App"; // Your main App component
import { name as appName } from "./app.json";

// Import CometChat SDK and UI Kit
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { CometChatUIKit, UIKitSettings } from "@cometchat/chat-uikit-react-native";

// Request permissions on Android (camera, audio, etc.)
const getPermissions = () => {
  if (Platform.OS === "android") {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  }
};

// Initialize CometChat SDK and UI Kit
const initializeCometChat = () => {
  // Ensure we have the necessary permissions
  getPermissions();

  // CometChat initialization settings
  const uikitSettings = {
    appId: "2730366660accc07", // Replace with your app ID
    authKey: "f31b5cfc8f581a26bc1d55948ea5ab3564b9c61d", // Replace with your auth key
    region: "us", // Replace with your region (e.g., 'us', 'eu', etc.)
    subscriptionType: CometChat.AppSettings.SUBSCRIPTION_TYPE_ALL_USERS,
  };

  // Initialize the CometChat UI Kit
  CometChatUIKit.init(uikitSettings)
    .then(() => {
      console.log("CometChat UI Kit successfully initialized.");
    })
    .catch((error) => {
      console.error("CometChat initialization failed with error:", error);
    });
};

// Call the initialization function when the app starts
initializeCometChat();

AppRegistry.registerComponent(appName, () => App);

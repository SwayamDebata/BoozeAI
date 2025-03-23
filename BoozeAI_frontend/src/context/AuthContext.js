import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error loading token:", error);
      }
    };

    loadToken();
  }, []);

  const saveToken = async (newToken) => {
    try {
      await AsyncStorage.setItem("userToken", newToken);
      setToken(newToken);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken: saveToken }}>
      {children}
    </AuthContext.Provider>
  );
};

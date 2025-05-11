import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, FlatList, Linking, ActivityIndicator,
  StyleSheet, PermissionsAndroid, Platform, TouchableOpacity, Alert
} from "react-native";
import axios from "axios";
import Geolocation from "react-native-geolocation-service";
import LottieView from "lottie-react-native";
import { useFocusEffect } from '@react-navigation/native';

const FOURSQUARE_API_KEY = "fsq3EenX8Pa+QekkeDvCdyKQRi6sOfA4lfqvWGarDoTBpUs=";
const FOURSQUARE_URL = "https://api.foursquare.com/v3/places/search";

const NearbyScreen = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      requestLocationPermission();
    }, [])
  );
  

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Access Required",
            message: "This app needs to access your location to show nearby liquor stores.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Deny",
            buttonPositive: "Allow",
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permission Denied", "Location access is needed to find nearby liquor stores.");
          return;
        }
      } catch (err) {
        console.warn("Permission request error:", err);
      }
    }

    Geolocation.getCurrentPosition(
      (position) => {
        fetchLiquorStores(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Error fetching location:", error);
        setError("Unable to retrieve location. Please enable GPS and try again.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchLiquorStores = async (latitude, longitude) => {
    const queries = ["liquor store", "wine shop", "wines", "alcohol"];
    const allResults = [];
  
    try {
      for (const query of queries) {
        const res = await axios.get(FOURSQUARE_URL, {
          headers: {
            Authorization: `fsq3EenX8Pa+QekkeDvCdyKQRi6sOfA4lfqvWGarDoTBpUs=`,
          },
          params: {
            query,
            ll: `${latitude},${longitude}`,
            radius: 5000,
            limit: 30, 
          },
        });
  
        if (res.data.results) {
          allResults.push(...res.data.results);
        }
      }
  
      const uniqueResults = Array.from(
        new Map(allResults.map((shop) => [shop.fsq_id, shop])).values()
      );
  
      setShops(uniqueResults);
    } catch (error) {
      console.error("Error fetching liquor stores:", error);
      setError("Failed to fetch nearby stores. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.lottieWrapper}>
          <LottieView
            source={require("../../assets/loading1.json")}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
        </View>
        <Text style={styles.loadingText}>Finding nearby liquor stores...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.header}>🍸 Nearby Liquor Stores</Text>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={shops}
          keyExtractor={(item) => item.fsq_id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.shopContainer}>
              <Text style={styles.shopName}>{item.name || "Unknown Store"}</Text>
              {item.geocodes?.main?.latitude && item.geocodes?.main?.longitude ? (
                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${item.geocodes.main.latitude},${item.geocodes.main.longitude}`)}
                >
                  <Text style={styles.mapButtonText}>📍 Open in Google Maps</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.errorText}>Location not available</Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default NearbyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1C1C3A", // Deep purple background
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D1C4E9", // Soft lavender text
    marginBottom: 20,
    textAlign: "center",
  },
  shopContainer: {
    padding: 15,
    backgroundColor: "#3A2E6E", // Darker purple card background
    marginBottom: 10,
    borderRadius: 12,
  },
  shopName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#EDE7F6", // Light lavender for shop names
    marginBottom: 5,
  },
  mapButton: {
    backgroundColor: "#5D3FD3", // Rich purple button
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  mapButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1C1C3A", // Match theme background
  },
  lottieWrapper: {
    width: 180,
    height: 180,
    borderRadius: 90, // Fully rounded
    overflow: "hidden",
    backgroundColor: "rgba(28, 28, 58, 0.6)", // Semi-transparent dark theme
    borderWidth: 4,
    borderColor: "#D1C4E9", // Soft lavender border
    justifyContent: "center",
    alignItems: "center",
  },
  lottieAnimation: {
    width: "100%",
    height: "100%",
  },
  loadingText: {
    color: "#EDE7F6",
    fontSize: 16,
    marginTop: 15,
    fontWeight: "500",
  },

  errorText: {
    color: "#FF5252", // Red for errors
    textAlign: "center",
    fontSize: 16,
  },
});

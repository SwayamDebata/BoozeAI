import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, Linking, ActivityIndicator, 
  StyleSheet, PermissionsAndroid, Platform, TouchableOpacity, Alert 
} from "react-native";
import axios from "axios";
import Geolocation from "react-native-geolocation-service";

const NearbyScreen = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestLocationPermission();
  }, []);

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
          console.log("Location permission denied");
          return;
        }
      } catch (err) {
        console.warn("Permission request error:", err);
      }
    }

    Geolocation.getCurrentPosition(
      (position) => {
        console.log("User Location:", position.coords);
        fetchLiquorStores(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Error fetching location:", error);
        Alert.alert("Location Error", "Unable to retrieve location. Please enable GPS.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchLiquorStores = async (latitude, longitude) => {
    try {
      console.log(`Fetching stores at: ${latitude}, ${longitude}`);
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: "bar",
            format: "json",
            limit: 10,
            lat: latitude,
            lon: longitude,
          },
        }
      );
      console.log("API Response:", response.data);
      if (response.data.length === 0) {
        console.log("No stores found");
      }
      setShops(response.data);
    } catch (error) {
      console.error("Error fetching liquor stores:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2A004E" />
        <Text style={styles.loadingText}>Finding nearby liquor shops...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🍸 Nearby Liquor Shops</Text>
      <FlatList
        data={shops}
        keyExtractor={(item) => item.place_id || item.osm_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.shopContainer}>
            <Text style={styles.shopName}>{item.display_name}</Text>
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() =>
                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`)
              }
            >
              <Text style={styles.mapButtonText}>📍 Open in Google Maps</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default NearbyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1A1A1A", // Dark mode background
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F1FAEE", // Soft white text
    marginBottom: 15,
    textAlign: "center",
  },
  shopContainer: {
    padding: 15,
    backgroundColor: "#2C2C2C", // Dark card background
    marginBottom: 10,
    borderRadius: 10,
  },
  shopName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F4A261", // Warm orange for shop names
    marginBottom: 5,
  },
  mapButton: {
    backgroundColor: "#2A004E", // Deep Purple button
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  mapButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#bbb",
  },
});

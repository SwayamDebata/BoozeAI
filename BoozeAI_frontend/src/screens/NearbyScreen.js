import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Linking, ActivityIndicator, StyleSheet, PermissionsAndroid, Platform } from "react-native";
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
        `https://nominatim.openstreetmap.org/search`,
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
      console.log("API Response:", response.data);  // ✅ Debugging log
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
        <ActivityIndicator size="large" color="#008080" />
        <Text>Loading nearby liquor shops...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nearby Liquor Shops</Text>
      <FlatList
        data={shops}
        keyExtractor={(item) => item.place_id || item.osm_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.shopContainer}>
            <Text style={styles.shopName}>{item.display_name}</Text>
            <Text
              style={styles.link}
              onPress={() =>
                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`)
              }
            >
              Open in Google Maps
            </Text>
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
    backgroundColor: "white",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  shopContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  shopName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    fontSize: 16,
    color: "#ffffff",
    marginTop: 5,
  },
});

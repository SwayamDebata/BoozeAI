import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LottieView from "lottie-react-native";
import { useFocusEffect } from "@react-navigation/native";

const FavouriteScreen = () => {
  const [token, setToken] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) setToken(storedToken);
      } catch (error) {
        console.error("❌ Error retrieving token:", error);
      }
    };
    getToken();
  }, []);
  

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchFavourites(token).finally(() => setLoading(false));
      }
    }, [token])
  );
  

  

  const fetchTokenAndFavourites = async () => {
    try {
      setLoading(true);
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await fetchFavourites(storedToken);
      }
    } catch (error) {
      console.error("❌ Error retrieving token:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavourites = async (authToken) => {
    try {
      const response = await axios.get("https://boozeai.onrender.com/api/drinks/favourites", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setFavourites(response.data.favourites || []);
    } catch (error) {
      console.error("❌ Error fetching favourites:", error);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFavourites(token);
    setRefreshing(false);
  }, [token]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const removeFavourite = async (id) => {
    try {
      await axios.delete(`https://boozeai.onrender.com/api/drinks/favourites/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavourites(favourites.filter(item => item._id !== id));
    } catch (error) {
      console.error("❌ Error removing favourite:", error);
    }
  };

  const extractCocktailName = (suggestion) => {
    const match = suggestion.match(/Cocktail Name:\s*(.+)/i);
    return match && match[1] ? match[1].trim() : "UNKNOWN COCKTAIL";
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <View style={styles.lottieWrapper}>
          <LottieView
            source={require("../../assets/loading1.json")}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
        </View>
        <Text style={styles.loadingText}>Loading your favourites...</Text>
      </View>

    );
  }



  return (
    <View style={styles.container}>
      <Text style={styles.header}>🍸 Your Favourite Drinks</Text>

      {favourites.length === 0 ? (
        <Text style={styles.noFavsText}>No favourite drinks yet! Add some delicious cocktails 🍹</Text>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item) => item._id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          renderItem={({ item }) => {
            const cocktailName = extractCocktailName(item.suggestion);
            const isExpanded = expandedId === item._id;

            return (
              <View style={styles.card}>
                <TouchableOpacity onPress={() => toggleExpand(item._id)} style={styles.dropdownHeader}>
                  <Text style={styles.boldText}>🍹 {cocktailName}</Text>
                  <Text style={styles.arrow}>{isExpanded ? "▲" : "▼"}</Text>
                </TouchableOpacity>
                {isExpanded && (
                  <View style={styles.expandedContainer}>
                    <Text style={styles.detailsText}>{item.suggestion}</Text>
                    <TouchableOpacity onPress={() => removeFavourite(item._id)} style={styles.removeButton}>
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1C1C3A", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", color: "#D1C4E9", textAlign: "center", marginBottom: 15 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  noFavsText: { fontSize: 18, color: "#C5CAE9", textAlign: "center", marginTop: 20 },
  card: { backgroundColor: "#3A2E6E", padding: 15, marginVertical: 6, borderRadius: 12 },
  dropdownHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  boldText: { fontSize: 18, fontWeight: "bold", color: "#EDE7F6" },
  arrow: { fontSize: 16, color: "#EDE7F6" },
  expandedContainer: { marginTop: 10, backgroundColor: "#5D3FD3", padding: 12, borderRadius: 8 },
  detailsText: { fontSize: 14, color: "#FFFFFF" },
  removeButton: { backgroundColor: "#3A2E6E", padding: 10, borderRadius: 8, marginTop: 10, alignItems: "center" },
  removeButtonText: { color: "#D1C4E9", fontSize: 16, fontWeight: "bold" },
  centered: {
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

});

export default FavouriteScreen;

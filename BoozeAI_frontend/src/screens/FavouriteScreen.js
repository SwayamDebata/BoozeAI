import React, { useEffect, useState, useCallback } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const FavouriteScreen = () => {
  const [token, setToken] = useState(null);
  const [favourites, setFavourites] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchTokenAndFavourites();
  }, []);

  const fetchTokenAndFavourites = async () => {
    try {
      setLoading(true);
      const storedToken = await AsyncStorage.getItem("token");
      if (!storedToken) {
        console.warn("⚠️ Token is missing!");
      } else {
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
      if (response.data.favourites) {
        setFavourites(response.data.favourites);
      }
    } catch (error) {
      console.error("❌ Error fetching favourites:", error);
    }
  };

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFavourites(token);
    setRefreshing(false);
  }, [token]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const extractCocktailName = (suggestion) => {
    const match = suggestion.match(/Cocktail Name:\s*(.+)/i);
    return match && match[1] ? match[1].trim() : "UNKNOWN COCKTAIL";
  };

  const formatSuggestion = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, (_, match) => `\n${match.toUpperCase()}`);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ffcc00" />
        <Text style={styles.loadingText}>Loading your favourites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🍸 Your Favourite Drinks</Text>

      {Array.isArray(favourites) && favourites.length === 0 ? (
        <Text style={styles.noFavsText}>No favourite drinks yet! Add some delicious cocktails 🍹</Text>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item) => item._id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
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
                    <Text style={styles.detailsText}>{formatSuggestion(item.suggestion)}</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#C62300",
    textAlign: "center",
    marginBottom: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#bbb",
  },
  noFavsText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#2A004E",
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  boldText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F14A00",
  },
  arrow: {
    fontSize: 16,
    color: "#F14A00",
  },
  expandedContainer: {
    marginTop: 10,
    backgroundColor: "#500073",
    padding: 12,
    borderRadius: 8,
  },
  detailsText: {
    fontSize: 14,
    color: "#ffa882",
  },
});

export default FavouriteScreen;

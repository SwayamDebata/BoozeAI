import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import drink from '../../assets/man.png'
const DrinkDetailScreen = ({ route, navigation }) => {
    const { drinkSuggestion } = route.params;
    
    const addToFavourite = async () => {
        if (!drinkSuggestion || !drinkSuggestion.id) {
            alert("Drink ID is missing!");
            console.error("Drink suggestion data:", drinkSuggestion);
            return;
        }

        try {
            const response = await fetch("https://boozeai.onrender.com/api/drinks/favourites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.trim()}`,
                },
                body: JSON.stringify({ drinkId: drinkSuggestion.id }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Added to Favourites!");
            } else {
                alert(data.error || "Failed to add to favourites");
            }
        } catch (error) {
            console.error("Error adding to favourites:", error);
            alert("Something went wrong!");
        }
    };
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ url: drinkSuggestion?.image || drink }} style={styles.image} />
            <Text style={styles.title}>{drinkSuggestion?.name || "Unknown Drink"}</Text>
            <Text style={styles.description}>{drinkSuggestion?.description || "No description available."}</Text>
            
            <TouchableOpacity style={styles.favButton} onPress={() => {addToFavourite}}>
                <Text style={styles.favButtonText}>❤️ Add to Favourite</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                <Text style={styles.closeButtonText}>Go Back</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f8f8f8",
    },
    image: {
        width: "100%",
        height: 300,
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 10,
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    favButton: {
        backgroundColor: "#ff4757",
        padding: 10,
        borderRadius: 5,
        width: "80%",
        alignItems: "center",
        marginBottom: 10,
    },
    favButtonText: {
        color: "white",
        fontSize: 18,
    },
    closeButton: {
        backgroundColor: "#57606f",
        padding: 10,
        borderRadius: 5,
        width: "80%",
        alignItems: "center",
    },
    closeButtonText: {
        color: "white",
        fontSize: 18,
    },
});

export default DrinkDetailScreen;

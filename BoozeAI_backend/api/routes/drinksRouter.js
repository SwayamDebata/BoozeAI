const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Drink = require("../../models/drinksModel");
const User = require("../../models/userModel");
const { v4: uuidv4 } = require("uuid"); 

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT Verification Error:", err.message);
      return res.status(401).json({ error: "Invalid token" });
    }

    req.userId = decoded.userId;
    next();
  });
};

router.post(
  "/suggest",
  authenticate,
  asyncHandler(async (req, res) => {
    const { mood, weather, ingredients, instructions, category, budget } = req.body;

    console.log("Received request:", { mood, weather, ingredients, instructions, category, budget });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Suggest a unique cocktail recipe based on the following details:
- If Whiskey is suggested, randomly choose between Amrut, Paul John, Royal Stag, Blenders Pride, or Antiquity Blue.
- If Beer is suggested, randomly choose between Tuborg, Bira, or Kingfisher.
- If Rum is suggested, randomly choose between Old Monk, Bacardi, or another Indian rum brand. Avoid repeating the same brand frequently.
- If Vodka is suggested, randomly choose between Absolut, Magic Moments, Romanov, or another popular vodka brand.
- Important: Do not mix different liquor types (e.g., whiskey + rum + beer) in a single cocktail.
- Ensure fair rotation of liquor brands across different recipes.
- The budget should be presented in **Indian Rupees (₹ INR)**.
- The response should be formatted clearly **without any bullet points or special characters**.

Return the response in the following structured format **without extra commentary**:

Cocktail Name: [Name]  
Mood: ${mood}  
Weather: ${weather}  
Ingredients: [List ingredients in a plain format, e.g., 2 cloves, 50ml whiskey, 1 lime]  
Instructions: [Step-by-step method in plain text]  
Budget: ₹[Amount in INR]`;




    try {
      const result = await model.generateContent(prompt);
      const suggestion = result.response.text(); 

      const newDrink = new Drink({
        user: req.userId,
        mood,
        weather,
        ingredients,
        instructions,
        category,
        budget,
        suggestion,
      });

      const savedDrink = await newDrink.save();

      res.json({ id: savedDrink._id, suggestion });
    } catch (error) {
      console.error("Gemini API error:", error.message);
      res.status(500).json({ error: "Failed to generate a drink suggestion", details: error.message });
    }
  })
);





// Add a drink to the user's favourites
router.post(
  "/favourites",
  authenticate,
  asyncHandler(async (req, res) => {
    console.log("Request body:", req.body);

    const { drinkId } = req.body;

    if (!drinkId) {
      console.error("Error: Drink ID is missing");
      return res.status(400).json({ error: "Drink ID is required" });
    }

    try {
      const user = await User.findById(req.userId);
      console.log(user, "USER");
      
      if (!user) {
        console.error(`Error: User not found for ID ${req.userId}`);
        return res.status(404).json({ error: "User not found" });
      }

      if (user.favourite.includes(drinkId)) {
        console.error(`Error: Drink ${drinkId} already in favourites`);
        return res.status(400).json({ error: "Drink already in favourites" });
      }

      user.favourite.push(drinkId);
      await user.save();

      console.log(`Success: Drink ${drinkId} added to favourites`);
      res.status(200).json({ message: "Drink added to favourites", favourites: user.favourite });
    } catch (error) {
      console.error("Error adding to favourites:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
);






// Get user's favourite drinks
router.get(
  "/favourites",
  authenticate,
  asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.userId).populate("favourite"); // Populate drink details
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ favourites: user.favourite });
    } catch (error) {
      console.error("Error fetching favourites:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
);

router.get("/profile", authenticate, asyncHandler(async (req, res) => {
  try {
      const user = await User.findById(req.userId).select("-password");
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      console.log("Sending Profile:", user);  // Debugging
      res.status(200).json({ name: user.name, email: user.email, avatar: user.picture || "" });
  } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Internal server error" });
  }
}));


module.exports = router;

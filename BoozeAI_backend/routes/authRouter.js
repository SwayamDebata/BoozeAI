const express = require("express");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const admin = require("firebase-admin");
const User = require("../models/userModel");

const serviceAccount = require("../config/firebaseServiceAccount.json"); 

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const router = express.Router();

router.post(
  "/google-login",
  asyncHandler(async (req, res) => {
    const { token } = req.body; 

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { uid, name, email, picture } = decodedToken; 

      let user = await User.findOne({ googleId: uid }); 

      if (!user) {
        user = new User({ googleId: uid, name, email, picture });
        await user.save();
      }

      // Generate JWT token
      const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

      res.json({ user, token: jwtToken });
    } catch (error) {
      console.error("Firebase Auth Error:", error);
      res.status(401).json({ message: "Invalid Firebase token" });
    }
  })
);

module.exports = router;

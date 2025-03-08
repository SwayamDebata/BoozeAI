const mongoose = require("mongoose");

let isConnected = false; // Track connection status

const connectDb = async () => {
    if (isConnected) {
        console.log("Using existing database connection");
        return;
    }

    try {
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            writeConcern: { w: "majority" }, 
        });
        isConnected = true; // Mark as connected
        console.log("Database Connected", connect.connection.host, connect.connection.name);
    } catch (err) {
        console.error("Database Connection Error:", err);
        process.exit(1);
    }
};

module.exports = connectDb;

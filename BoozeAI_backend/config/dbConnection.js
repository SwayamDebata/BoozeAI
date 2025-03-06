const mongoose = require("mongoose")
const connectDb = async() => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            writeConcern: { w: "majority" }, 
        });
        console.log("Database Connected", connect.connection.host, connect.connection.name);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDb;
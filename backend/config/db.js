const mongoose = require('mongoose');
require("dotenv").config();
const DATABASE_URI = process.env.MONGODB_URI

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            DATABASE_URI || "",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        console.log(
            `MongoDB Connected: ${conn.connection.host}`
        );
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with failure
    }
}

module.exports = connectDB;

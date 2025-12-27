const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('[INIT] Connecting to MongoDB with URI:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('[DB] Mongo connected successfully');
    } catch (err) {
        console.error('[DB] Mongo connection failed', err);
        process.exit(1);
    }
};

module.exports = connectDB;

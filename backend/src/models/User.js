const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    stravaId: { type: Number, unique: true, required: true },
    firstname: String,
    lastname: String,
    profile: String,
    accessToken: String,
    refreshToken: String,
    expiresAt: Number,
    preferences: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

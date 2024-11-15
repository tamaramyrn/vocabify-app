import mongoose from "mongoose";

const Score = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    level: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true
    },
    questionCount: {
        type: Number,
        default: 0
    }
});

export default mongoose.model("ScoreScrambify", Score);

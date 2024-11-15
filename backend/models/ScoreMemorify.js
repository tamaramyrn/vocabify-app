import mongoose from "mongoose";

const ScoreMemorify = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    completedCards: {
        type: Number,
        default: 0
    }
});

export default mongoose.model("ScoreMemorify", ScoreMemorify);

import mongoose from 'mongoose';

const Word = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        unique: true,
    },
    hint: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
    }
}, { timestamps: true });

export default mongoose.model("WordScrambify", Word);
import mongoose from 'mongoose';

const MemoryCardSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        unique: true,
    },
    definition: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export default mongoose.model("MemoryCard", MemoryCardSchema);

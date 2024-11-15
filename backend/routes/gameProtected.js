import express from "express";
import auth from "../middleware/auth.js";
import WordMemorify from "../models/WordMemorify.js";
import WordScrambify from "../models/WordScrambify.js";
import ScoreMemorify from "../models/ScoreMemorify.js";
import ScoreScrambify from "../models/ScoreScrambify.js";

const router = express.Router();

// --- CRUD Operations for Memorify Words ---
router.post("/memorify/cards", async (req, res) => {
    const { word, definition } = req.body;
    if (!word || !definition) {
        return res.status(400).json({ message: "Word and definition are required" });
    }

    try {
        const newWord = new WordMemorify({ word, definition });
        const savedWord = await newWord.save();
        res.status(201).json({ message: "Word added to Memorify", word: savedWord });
    } catch (err) {
        res.status(500).json({ message: "Failed to add word", error: err.message });
    }
});

router.get('/memorify/cards', async (req, res) => {
    try {
        const words = await WordMemorify.find().limit(12); // Fetch word-meaning pairs from the database
        res.json(words);
    } catch (error) {
        console.error('Error fetching words:', error);
        res.status(500).send('Error fetching cards');
    }
});

// --- CRUD Operations for Scrambify Words ---
router.post("/scrambify/words", async (req, res) => {
    const { word, hint, level } = req.body;
    if (!word || !hint || !level) {
        return res.status(400).json({ message: "Word, hint, and level are required" });
    }

    try {
        const newWord = new WordScrambify({ word, hint, level });
        const savedWord = await newWord.save();
        res.status(201).json({ message: "Word added to Scrambify", word: savedWord });
    } catch (err) {
        res.status(500).json({ message: "Failed to add word", error: err.message });
    }
});

router.get("/scrambify/words", async (req, res) => {
    try {
        const words = await WordScrambify.find();
        res.status(200).json(words);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch words", error: err.message });
    }
});

router.post("/memorify/progress", async (req, res) => {
    const { username, completedCards } = req.body;

    if (!username || completedCards === undefined) {
        return res.status(400).json({ message: "Username and completedCards are required" });
    }

    try {
        const existingProgress = await ScoreMemorify.findOne({ username });

        if (existingProgress) {
            existingProgress.completedCards = completedCards;
            await existingProgress.save();
        } else {
            const newProgress = new ScoreMemorify({ username, completedCards });
            await newProgress.save();
        }

        res.status(201).json({ message: "Progress saved successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to save progress", error: err.message });
    }
});

router.post("/scrambify/progress", async (req, res) => {
    const { username, level, questionCount } = req.body;

    if (!username || !level || questionCount === undefined) {
        return res.status(400).json({ message: "Username, level, and question count are required" });
    }

    try {
        const existingProgress = await ScoreScrambify.findOne({ username, level });

        if (existingProgress) {
            existingProgress.questionCount = questionCount;
            await existingProgress.save();
        } else {
            const newProgress = new ScoreScrambify({ username, level, questionCount });
            await newProgress.save();
        }

        res.status(201).json({ message: "Progress saved successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to save progress", error: err.message });
    }
});

export default router;
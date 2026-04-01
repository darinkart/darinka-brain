const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors()); 
app.use(express.json());

// We initialize without the version here to avoid library conflicts
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

app.post('/api/translate', async (req, res) => {
    try {
        // 1. WE SWITCH TO GEMINI 3 (The 2026 model)
        // 2. WE FORCE v1beta INSIDE THE CALL
        const model = genAI.getGenerativeModel(
            { model: "gemini-3-flash-preview" },
            { apiVersion: 'v1beta' } 
        );

        const prompt = `You are Darinka, an AI with Intermediate III Quechua skills. 
        Translate this phrase to Quechua and provide a 1-sentence friendly explanation: "${req.body.phrase}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        res.json({ translation: response.text() });

    } catch (error) {
        // This will help us see if it's still hitting /v1/
        console.error("LOGS SHOW:", error.message);
        res.status(500).json({ 
            translation: "My brain is a bit fuzzy! Try again?",
            debug: error.message 
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Darinka 2026 is active on port ${PORT}`));

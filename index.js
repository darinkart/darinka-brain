const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors()); 
app.use(express.json());

// WE ARE USING THE NEWEST 2026 STABLE PATH
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

app.post('/api/translate', async (req, res) => {
    try {
        // CHANGED: Using "gemini-3-flash-preview" (The current 2026 standard)
        // AND: Explicitly forcing v1beta for Gemini 3 support
        const model = genAI.getGenerativeModel(
            { model: "gemini-3-flash-preview" },
            { apiVersion: 'v1beta' } 
        );

        const prompt = `You are Darinka, a friendly AI with Intermediate III Quechua skills. 
        Translate this to Quechua and add a 1-sentence explanation: "${req.body.phrase}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ translation: text });

    } catch (error) {
        console.error("DETAILED ERROR:", error.message || error);
        res.status(500).json({ 
            translation: "My brain is a bit fuzzy! Try again?",
            error_type: error.message 
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Darinka is awake on port ${PORT}`));

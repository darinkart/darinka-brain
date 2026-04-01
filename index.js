const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors()); // Allows your GitHub site to talk to this server
app.use(express.json());

// FIXED: We force v1beta right here at the start as a second argument
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY, { apiVersion: 'v1beta' });

app.post('/api/translate', async (req, res) => {
    try {
        // We define the model AND the version right here inside the request
        const model = genAI.getGenerativeModel(
            { model: "gemini-1.5-flash" },
            { apiVersion: 'v1beta' } 
        );

        const prompt = `System Instruction: You are Darinka. Translate: "${req.body.phrase}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ translation: response.text() });

    } catch (error) {
        console.error("DETAILED ERROR:", error.message);
        res.status(500).json({ translation: "Fuzzy brain!", debug: error.message });
    }
});

const PORT = process.env.PORT || 10000; 
app.listen(PORT, () => console.log(`Brain active on port ${PORT}`));

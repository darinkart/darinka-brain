const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors()); 
app.use(express.json());

// STRATEGY: We pass the version as the SECOND argument to the main constructor
// This forces every single call to use /v1beta/
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY, "v1beta");

app.post('/api/translate', async (req, res) => {
    try {
        // We use the most stable modern model name
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash" 
        });

        const prompt = `You are Darinka, an AI with Intermediate III Quechua skills. 
        Translate this phrase to Quechua and provide a 1-sentence friendly explanation: "${req.body.phrase}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ translation: text });

    } catch (error) {
        // This will now show /v1beta/ in the logs if successful
        console.error("DETAILED ERROR:", error.message || error);
        res.status(500).json({ 
            translation: "My brain is a bit fuzzy! Try again?",
            debug: error.message 
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Darinka is active on port ${PORT}`));

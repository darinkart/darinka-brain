const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors()); // This allows your GitHub site to talk to this server
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

app.post('/api/translate', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "You are Darinka. You have Intermediate III Quechua skills. When asked to translate, give the Quechua phrase and a 1-sentence explanation. Keep it short and friendly."
        });
        const result = await model.generateContent(`Translate to Quechua: ${req.body.phrase}`);
        res.json({ translation: result.response.text() });
    } catch (error) {
        res.status(500).json({ translation: "My brain is a bit fuzzy! Try again?" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Brain active on port ${PORT}`));

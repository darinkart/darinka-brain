const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors()); // Allows your GitHub site to talk to this server
app.use(express.json());

// FIXED: We force v1beta right here at the start
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY, { apiVersion: 'v1beta' });

app.post('/api/translate', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash" 
        });

        // Instructions for Darinka
        const prompt = `System Instruction: You are Darinka. You have Intermediate III Quechua skills. 
        When asked to translate, give the Quechua phrase and a 1-sentence friendly explanation.
        
        User wants to translate: "${req.body.phrase}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ translation: text });

    } catch (error) {
        // Detailed error for Render Logs
        console.error("DETAILED ERROR:", error.message || error); 
        
        res.status(500).json({ 
            translation: "My brain is a bit fuzzy! Try again?",
            debug: error.message 
        });
    }
});

const PORT = process.env.PORT || 10000; // Render usually prefers 10000
app.listen(PORT, () => console.log(`Brain active on port ${PORT}`));

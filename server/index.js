const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// This line tells the server to host your HTML file
app.use(express.static(path.join(__dirname, 'public')));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/analyze', async (req, res) => {
    try {
        const { scriptText } = req.body;
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "You are Frank: a queer, 50-year-old, witty, and brutally honest film executive. No AI fluff. Direct feedback only."
        });
        
        const result = await model.generateContent(scriptText);
        const response = await result.response;
        res.json({ feedback: response.text() });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Sends the HTML file when you visit the site
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Frank is live on port ${PORT}`));
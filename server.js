const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/generate-image', (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ success: false, error: "Prompt is required" });
    }

    // Trim whitespace to prevent URL routing errors
    const cleanPrompt = prompt.trim();
    console.log(`Building FREE image URL for: ${cleanPrompt}`);

    const seed = Math.floor(Math.random() * 999999);
    const encoded = encodeURIComponent(cleanPrompt);
    
    // Using the free tier endpoint without the paid "nologo=true" parameter
    const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${seed}`;

    res.json({ success: true, url: imageUrl });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ZenoAI Image Backend running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Get your free API key at: https://enter.pollinations.ai
const POLLEN_KEY = process.env.POLLEN_KEY || ''; // set as Render env variable

app.post('/api/generate-image', (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ success: false, error: "Prompt is required" });
    }

    console.log(`Building image URL for: ${prompt}`);

    const seed = Math.floor(Math.random() * 999999);
    const encoded = encodeURIComponent(prompt);
    const keyParam = POLLEN_KEY ? `&key=${POLLEN_KEY}` : '';
    const imageUrl = `https://gen.pollinations.ai/image/${encoded}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux${keyParam}`;

    res.json({ success: true, url: imageUrl });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ZenoAI Image Backend running on port ${PORT}`);
});

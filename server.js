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

    console.log(`Building 2026 FREE image URL for: ${prompt}`);

    // Generate a random seed so you get a different image every time
    const seed = Math.floor(Math.random() * 999999);
    
    // Encode the prompt (e.g. "A man" becomes "A%20man")
    const encoded = encodeURIComponent(prompt);
    
    // THE 2026 FIX: 
    // 1. Using the unified gateway: gen.pollinations.ai
    // 2. NO API KEY (Falls back to the free, no-account tier)
    // 3. Removed premium params (nologo and model=flux) to avoid 402 Payment errors
    const imageUrl = `https://gen.pollinations.ai/image/${encoded}?width=1024&height=1024&seed=${seed}`;

    // Send the correct URL back to your HTML frontend
    res.json({ success: true, url: imageUrl });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ZenoAI Image Backend running on port ${PORT}`);
});

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

    console.log(`Building FREE image URL for: ${prompt}`);

    // Generate a random seed so you get a different image every time
    const seed = Math.floor(Math.random() * 999999);
    
    // Encode the prompt (e.g. "A man" becomes "A%20man")
    const encoded = encodeURIComponent(prompt);
    
    // THE FIX: We are using the dedicated FREE endpoint (image.pollinations.ai/prompt/)
    // This endpoint explicitly bypasses the 401 Authentication Required error.
    const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${seed}&nologo=true`;

    // Send the correct URL back to your HTML frontend
    res.json({ success: true, url: imageUrl });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ZenoAI Image Backend running on port ${PORT}`);
});

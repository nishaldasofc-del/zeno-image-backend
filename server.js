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

    console.log(`Building image URL for: ${prompt}`);

    // Pollinations blocks server-side fetches (Cloudflare 530) from datacenter IPs.
    // Solution: build the URL here and let the BROWSER load the image directly —
    // browser requests are never blocked by Cloudflare.
    const seed = Math.floor(Math.random() * 999999);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;

    res.json({ success: true, url: imageUrl });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ZenoAI Image Backend running on port ${PORT}`);
});

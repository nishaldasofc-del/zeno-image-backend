const express = require('express');
const cors = require('cors');

const app = express();

// Allow your frontend to talk to this backend
app.use(cors());
app.use(express.json());

// Health check — keeps Render happy and lets frontend ping to wake the server
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        console.log(`Generating image for: ${prompt}`);

        // 1. Format the stable Pollinations URL
        const encodedPrompt = encodeURIComponent(prompt);
        const seed = Math.floor(Math.random() * 999999);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true`;

        // 2. Fetch the image with a 90s timeout — Pollinations can be slow
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);

        let response;
        try {
            response = await fetch(imageUrl, { signal: controller.signal });
        } finally {
            clearTimeout(timeout);
        }

        if (!response.ok) throw new Error(`Pollinations returned ${response.status}`);

        // 3. Convert the image buffer to Base64 so we can send it securely to the frontend
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;

        // 4. Send the image back to your ZenoAI frontend!
        res.json({ success: true, image: base64Image });

    } catch (error) {
        console.error("Image Gen Error:", error.message);
        const timedOut = error.name === 'AbortError';
        res.status(500).json({
            success: false,
            error: timedOut ? "Pollinations timed out — try again" : "Failed to generate image"
        });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ZenoAI Image Proxy Backend running on port ${PORT}`);
});

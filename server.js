const express = require('express');
const cors = require('cors');

const app = express();

// Allow your frontend to talk to this backend
app.use(cors());
app.use(express.json());

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

        // 2. Fetch the image directly from your Node.js server
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error("Provider failed to generate image");

        // 3. Convert the image buffer to Base64 so we can send it securely to the frontend
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;

        // 4. Send the image back to your ZenoAI frontend!
        res.json({ success: true, image: base64Image });

    } catch (error) {
        console.error("Image Gen Error:", error.message);
        res.status(500).json({ success: false, error: "Failed to generate image" });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ZenoAI Image Proxy Backend running on port ${PORT}`);
});
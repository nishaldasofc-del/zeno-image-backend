app.post('/api/generate-image', (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ success: false, error: "Prompt is required" });
    }

    // 1. Trim whitespace to prevent URL routing errors (removes the %20 before the ?)
    const cleanPrompt = prompt.trim();
    console.log(`Building FREE image URL for: ${cleanPrompt}`);

    const seed = Math.floor(Math.random() * 999999);
    const encoded = encodeURIComponent(cleanPrompt);
    
    // 2. THE FIX: Removed &nologo=true so the server doesn't hang looking for payment!
    const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${seed}`;

    res.json({ success: true, url: imageUrl });
});

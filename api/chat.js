module.exports = async (req, res) => {
  // POST request check
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ text: "API Key missing in Vercel settings!" });
  }

  try {
    const { prompt } = req.body;
    
    // Stable API endpoint for Gemini 1.5 Flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt || "Hello" }] }]
        })
      }
    );

    const data = await response.json();
    
    // Response check logic
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
      res.status(200).json({ text: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ text: "AI Response Error: " + (data.error ? data.error.message : "Invalid Data") });
    }
  } catch (error) {
    res.status(500).json({ text: "Server Error: " + error.message });
  }
};

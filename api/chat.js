module.exports = async (req, res) => {
  // Method check
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ text: "Vercel settings mein API Key nahi mili!" });
  }

  try {
    const { prompt } = req.body;
    
    // Aapke system ke anusar Gemini 2.0 Flash model ka upyog
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt || "Namaste" }] }]
        })
      }
    );

    const data = await response.json();
    
    // Check if AI response is valid
    if (data.candidates && data.candidates[0].content) {
      res.status(200).json({ text: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ text: "AI Error: " + (data.error ? data.error.message : "Invalid Model Response") });
    }
  } catch (error) {
    res.status(500).json({ text: "Server Error: " + error.message });
  }
};



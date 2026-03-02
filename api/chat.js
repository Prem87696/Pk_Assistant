const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Check if it's a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ text: "Backend Error: Vercel settings mein API Key nahi mili!" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Updated stable model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ text: "Aapne kuch bola nahi." });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ text: "Google AI Error: " + error.message });
  }
};

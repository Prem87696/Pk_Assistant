const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Sirf POST request allow karein
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ text: "Backend Error: API Key nahi mili!" });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { prompt } = req.body;
    const result = await model.generateContent(prompt || "Namaste");
    const response = await result.response;
    const text = response.text();
    
    // Sahi JSON format bhejna zaroori hai
    res.status(200).json({ text: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ text: "Google AI Error: " + error.message });
  }
};

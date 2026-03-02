const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ text: "API Key missing in Vercel settings!" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // 'gemini-1.5-flash' ki jagah 'gemini-pro' use karein jo stable hai
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const { prompt } = req.body;
    const result = await model.generateContent(prompt || "Namaste");
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ text: "Google AI Error: " + error.message });
  }
};

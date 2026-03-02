const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Method Check
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Sirf POST request allow hai." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ text: "Vercel mein GEMINI_API_KEY missing hai!" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Latest stable model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ text: "Kripya kuch boliye." });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ text: "Google AI Error: Model not responding. Kripya key aur quota check karein." });
  }
};

const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Sirf POST request allow karein
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { prompt } = req.body;
    
    if (!prompt) {
        return res.status(400).json({ error: "No prompt provided" });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Yahan hum pakka kar rahe hain ki 'text' naam ki field hi jaye
    res.status(200).json({ text: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "API Error: Key check karein ya quota khatam ho gaya hai." });
  }
};

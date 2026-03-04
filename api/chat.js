module.exports = async (req, res) => {

  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ text: "Vercel settings mein API Key nahi mili!" });
  }

  try {

    const { prompt } = req.body || {};

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: prompt || "Namaste" }] }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        text: "Gemini Error: " + (data.error?.message || "Unknown error")
      });
    }

    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    res.status(200).json({
      text: aiText || "AI ne koi jawab nahi diya"
    });

  } catch (error) {

    res.status(500).json({
      text: "Server Error: " + error.message
    });

  }

};

```javascript
module.exports = async (req, res) => {

  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ text: "API key missing" });
  }

  try {

    const { prompt } = req.body || {};

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt || "Namaste" }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        text: data.error?.message || "Gemini API Error"
      });
    }

    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      text: aiText || "AI response empty"
    });

  } catch (error) {

    return res.status(500).json({
      text: "Server Error: " + error.message
    });

  }

};
```

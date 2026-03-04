```javascript
export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ text: "Missing API key" });
  }

  try {

    const { prompt } = req.body || {};

    const r = await fetch(
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

    const data = await r.json();

    if (!r.ok) {
      return res.status(500).json({
        text: data.error?.message || "Gemini error"
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      text: text || "No response"
    });

  } catch (e) {

    return res.status(500).json({
      text: "Server error: " + e.message
    });

  }

}
```

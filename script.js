const startBtn = document.getElementById('start-btn');
const status = document.getElementById('status');
const chatDisplay = document.getElementById('chat-display');

// Browser Voice Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    status.innerText = "Aapka browser voice recognition support nahi karta.";
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Hindi input ke liye

    startBtn.onclick = () => {
        recognition.start();
        status.innerText = "Main sun raha hoon...";
    };

    recognition.onresult = async (event) => {
        const userText = event.results[0][0].transcript;
        status.innerText = "Aapne kaha: " + userText;

        try {
            // Vercel Backend (api/chat.js) ko data bhejna
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userText })
            });

            const data = await response.json();

            // Check karein ki data sahi mila ya nahi
            if (data.text) {
                chatDisplay.innerText = data.text;
                speak(data.text);
                status.innerText = "Taiyar hai...";
            } else {
                // Agar 'undefined' ki dikkat hai toh ye error dikhayega
                console.error("API Error:", data);
                chatDisplay.innerText = "AI se jawab nahi mila. Check API Key!";
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            status.innerText = "Server se connect nahi ho paya.";
        }
    };
}

// Bolne wala function
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN'; // Hindi voice output
    window.speechSynthesis.speak(utterance);
}

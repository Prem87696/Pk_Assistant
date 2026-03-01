const startBtn = document.getElementById('start-btn');
const status = document.getElementById('status');
const chatDisplay = document.getElementById('chat-display');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'hi-IN';

startBtn.onclick = () => {
    recognition.start();
    status.innerText = "Suna ja raha hai...";
};

recognition.onresult = async (event) => {
    const userText = event.results[0][0].transcript;
    status.innerText = "Aapne kaha: " + userText;
    chatDisplay.innerText = "AI soch raha hai...";

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userText })
        });

        const data = await response.json();

        // 'undefined' se bachne ke liye check
        if (data && data.text) {
            chatDisplay.innerText = data.text;
            speak(data.text);
        } else {
            chatDisplay.innerText = "Error: " + (data.error || "Jawab nahi mil paya");
        }
    } catch (err) {
        chatDisplay.innerText = "Network Error: Backend se connect nahi ho paya.";
    }
    status.innerText = "Taiyar hai...";
};

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    window.speechSynthesis.speak(utterance);
}

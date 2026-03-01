const startBtn = document.getElementById('start-btn');
const status = document.getElementById('status');
const chatDisplay = document.getElementById('chat-display');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'hi-IN';

startBtn.onclick = () => {
    recognition.start();
    status.innerText = "Suna ja raha hai...";
};

recognition.onresult = async (event) => {
    const userText = event.results[0][0].transcript;
    status.innerText = "Aapne kaha: " + userText;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userText })
        });
        const data = await response.json();
        chatDisplay.innerText = data.text;
        speak(data.text);
    } catch (err) {
        status.innerText = "Error: API connect nahi ho payi.";
    }
};

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    window.speechSynthesis.speak(utterance);
    status.innerText = "AI bol raha hai...";
}
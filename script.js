const startBtn = document.getElementById('start-btn');
const status = document.getElementById('status');
const chatDisplay = document.getElementById('chat-display');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    status.innerText = "Browser support nahi karta.";
} else {
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
            
            // Yahan check karein ki data.text maujood hai ya nahi
            if (data && data.text) {
                chatDisplay.innerText = data.text;
                speak(data.text);
            } else {
                chatDisplay.innerText = "Error: Jawab khali mila.";
            }
        } catch (err) {
            chatDisplay.innerText = "Network Error: Server se connection nahi hua.";
        }
    };
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    window.speechSynthesis.speak(utterance);
}

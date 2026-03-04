const startBtn = document.getElementById('start-btn');
const status = document.getElementById('status');
const chatDisplay = document.getElementById('chat-display');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {

    status.innerText = "Browser speech recognition support nahi karta.";

} else {

    const recognition = new SpeechRecognition();

    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    startBtn.onclick = () => {

        recognition.start();
        status.innerText = "Suna ja raha hai...";

    };

    recognition.onresult = async (event) => {

        const userText = event.results[0][0].transcript;

        status.innerText = "Aapne kaha: " + userText;

        chatDisplay.innerText = "AI soch raha hai...";

        try {

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt: userText })
            });

            if (!response.ok) {

                chatDisplay.innerText = "Server Error: AI response nahi mila.";
                return;

            }

            const data = await response.json();

            if (data && data.text) {

                chatDisplay.innerText = data.text;

                speak(data.text);

            } else {

                chatDisplay.innerText = "AI ne koi response nahi diya.";

            }

        } catch (err) {

            chatDisplay.innerText = "Network Error: Server se connection nahi hua.";

        }

    };

    recognition.onerror = (event) => {

        status.innerText = "Speech Error: " + event.error;

    };

}

function speak(text) {

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "hi-IN";

    utterance.rate = 1;

    window.speechSynthesis.speak(utterance);

}

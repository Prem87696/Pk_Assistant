 
document.addEventListener("DOMContentLoaded", () => {

const startBtn = document.getElementById("start-btn");
const status = document.getElementById("status");
const chatDisplay = document.getElementById("chat-display");

const textInput = document.getElementById("text-input");
const sendBtn = document.getElementById("send-btn");

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

/* -------- VOICE SYSTEM -------- */

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

recognition.onresult = (event) => {

const userText = event.results[0][0].transcript;

status.innerText = "Aapne kaha: " + userText;

sendToAI(userText);

};

recognition.onerror = (event) => {

status.innerText = "Speech Error: " + event.error;

};

}

/* -------- TEXT CHAT -------- */

sendBtn.onclick = sendText;

textInput.addEventListener("keypress", (e) => {

if (e.key === "Enter") sendText();

});

function sendText(){

const userText = textInput.value.trim();

if(!userText) return;

textInput.value="";

status.innerText = "Aapne likha: " + userText;

sendToAI(userText);

}

/* -------- API CALL -------- */

async function sendToAI(userText){

chatDisplay.innerText = "AI soch raha hai...";

try{

const response = await fetch("/api/chat",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
prompt:userText
})
});

const raw = await response.text();

let data;

try{
data = JSON.parse(raw);
}catch{
data = {text:raw};
}

if(!response.ok){

chatDisplay.innerText =
data.text || "Server Error: AI response nahi mila.";

return;

}

if(data && data.text){

chatDisplay.innerText = data.text;

speak(data.text);

}else{

chatDisplay.innerText="AI ne koi response nahi diya.";

}

}catch(err){

chatDisplay.innerText="Network Error: Server se connection nahi hua.";

}

}

/* -------- SPEECH OUTPUT -------- */

function speak(text){

window.speechSynthesis.cancel();

const utterance = new SpeechSynthesisUtterance(text);

utterance.lang="hi-IN";
utterance.rate=1;

window.speechSynthesis.speak(utterance);

}

});
 

 
document.addEventListener("DOMContentLoaded", () => {

const startBtn = document.getElementById("start-btn");
const status = document.getElementById("status");
const chatDisplay = document.getElementById("chat-display");

const textInput = document.getElementById("text-input");
const sendBtn = document.getElementById("send-btn");

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

/* -------- VOICE SYSTEM -------- */

if (SpeechRecognition) {

const recognition = new SpeechRecognition();

recognition.lang = "hi-IN";

startBtn.onclick = () => {

recognition.start();
status.innerText = "Suna ja raha hai...";

};

recognition.onresult = (event) => {

const userText = event.results[0][0].transcript;

status.innerText = "Aapne kaha: " + userText;

sendToAI(userText);

};

}

/* -------- TEXT CHAT -------- */

sendBtn.onclick = sendText;

textInput.addEventListener("keypress",(e)=>{
if(e.key==="Enter") sendText();
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

const data = await response.json();

if(data && data.text){

chatDisplay.innerText = data.text;

speak(data.text);

}else{

chatDisplay.innerText="AI response nahi mila.";

}

}catch(err){

chatDisplay.innerText="Server error.";

}

}

/* -------- SPEECH OUTPUT -------- */

function speak(text){

window.speechSynthesis.cancel();

const utterance = new SpeechSynthesisUtterance(text);

utterance.lang="hi-IN";

window.speechSynthesis.speak(utterance);

}

});
 

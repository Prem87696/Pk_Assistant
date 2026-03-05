document.addEventListener("DOMContentLoaded", function(){

const chatBox = document.getElementById("chat-box");
const textInput = document.getElementById("text-input");
const sendBtn = document.getElementById("send-btn");
const micBtn = document.getElementById("mic-btn");

/* ADD MESSAGE */

function addMessage(text,type){

const msg = document.createElement("div");

msg.className = "msg " + type;

msg.innerText = text;

chatBox.appendChild(msg);

chatBox.scrollTop = chatBox.scrollHeight;

}

/* SEND TEXT */

function sendText(){

const text = textInput.value.trim();

if(!text) return;

addMessage(text,"user");

textInput.value = "";

handleCommand(text);

}

sendBtn.onclick = sendText;

textInput.addEventListener("keypress", function(e){

if(e.key === "Enter") sendText();

});

/* SPEAK */

function speak(text){

const speech = new SpeechSynthesisUtterance(text);

speech.lang = "hi-IN";

speechSynthesis.cancel();

speechSynthesis.speak(speech);

}

/* VOICE INPUT */

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

if(SpeechRecognition){

const recognition = new SpeechRecognition();

recognition.lang = "hi-IN";
recognition.continuous = false;
recognition.interimResults = false;

micBtn.onclick = function(){

addMessage("🎤 बोलिए...","ai");

setTimeout(function(){

recognition.start();

},200);

};

recognition.onresult = function(event){

const text = event.results[0][0].transcript;

addMessage(text,"user");

handleCommand(text);

};

recognition.onerror = function(e){

addMessage("Mic error: " + e.error,"ai");

};

}

/* COMMAND SYSTEM */

function handleCommand(text){

text = text.toLowerCase().trim();

/* TIME */

if(
text.includes("time") ||
text.includes("समय") ||
text.includes("टाइम")
){

const time = new Date().toLocaleTimeString("hi-IN");

addMessage("अभी समय है " + time,"ai");

speak("अभी समय है " + time);

return;

}

/* YOUTUBE */

if(
text.includes("youtube") ||
text.includes("utube") ||
text.includes("यूट") ||
text.includes("यू ट्यूब")
){

addMessage("यूट्यूब खोल रहा हूँ","ai");

speak("यूट्यूब खोल रहा हूँ");

window.open("https://youtube.com");

return;

}

/* GOOGLE */

if(
text.includes("google") ||
text.includes("गूगल")
){

addMessage("गूगल खोल रहा हूँ","ai");

speak("गूगल खोल रहा हूँ");

window.open("https://google.com");

return;

}

/* WHATSAPP */

if(
text.includes("whatsapp") ||
text.includes("व्हाट्सएप")
){

addMessage("व्हाट्सएप खोल रहा हूँ","ai");

speak("व्हाट्सएप खोल रहा हूँ");

window.open("https://web.whatsapp.com");

return;

}

/* SEARCH */

if(
text.startsWith("search") ||
text.includes("खोजो")
){

let q = text.replace("search","").replace("खोजो","");

addMessage("Google पर खोज रहा हूँ","ai");

window.open(
"https://www.google.com/search?q=" + encodeURIComponent(q)
);

return;

}

/* DEFAULT AI */

sendToAI(text);

}

/* GEMINI API */

async function sendToAI(text){

addMessage("AI सोच रहा है...","ai");

try{

const res = await fetch("/api/chat",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
prompt:text
})

});

const data = await res.json();

chatBox.lastChild.remove();

if(data && data.text){

addMessage(data.text,"ai");

speak(data.text);

}else{

addMessage("AI response नहीं मिला","ai");

}

}catch{

chatBox.lastChild.remove();

addMessage("Server error","ai");

}

}

});

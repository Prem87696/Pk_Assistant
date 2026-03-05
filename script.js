document.addEventListener("DOMContentLoaded",()=>{

const chatBox=document.getElementById("chat-box");
const textInput=document.getElementById("text-input");
const sendBtn=document.getElementById("send-btn");
const micBtn=document.getElementById("mic-btn");

let assistantActive=false;
const wakeWord="hey pk";

const SpeechRecognition=
window.SpeechRecognition||window.webkitSpeechRecognition;

/* ADD MESSAGE */

function addMessage(text,type){

const msg=document.createElement("div");

msg.className="msg "+type;

msg.innerText=text;

chatBox.appendChild(msg);

chatBox.scrollTop=chatBox.scrollHeight;

}

/* SPEAK */

function speak(text){

const speech=new SpeechSynthesisUtterance(text);

speech.lang="hi-IN";

speechSynthesis.cancel();

speechSynthesis.speak(speech);

}

/* STREAM TYPING */

function typeMessage(text){

const msg=document.createElement("div");

msg.className="msg ai";

chatBox.appendChild(msg);

let i=0;

function typing(){

if(i<text.length){

msg.innerHTML+=text.charAt(i);

chatBox.scrollTop=chatBox.scrollHeight;

i++;

setTimeout(typing,15);

}

}

typing();

}

/* SEND TEXT */

sendBtn.onclick=sendText;

textInput.addEventListener("keypress",(e)=>{
if(e.key==="Enter") sendText();
});

function sendText(){

const text=textInput.value.trim();

if(!text) return;

addMessage(text,"user");

textInput.value="";

handleCommand(text);

}

/* VOICE LISTENING */

if(SpeechRecognition){

const recognition=new SpeechRecognition();

recognition.lang="hi-IN";
recognition.continuous=true;
recognition.interimResults=false;

/* AUTO START */

recognition.start();

recognition.onresult=(event)=>{

const text=event.results[event.results.length-1][0].transcript;

detectWakeWord(text);

};

recognition.onend=()=>{
recognition.start();
};

}

/* WAKE WORD */

function detectWakeWord(text){

text=text.toLowerCase();

if(text.includes(wakeWord)){

assistantActive=true;

addMessage("Ji boliye...","ai");

speak("Ji boliye");

return;

}

if(assistantActive){

addMessage(text,"user");

handleCommand(text);

assistantActive=false;

}

}

/* COMMAND SYSTEM */

function handleCommand(text){

text=text.toLowerCase().trim();

/* TIME */

if(text.includes("time")){

const time=new Date().toLocaleTimeString("hi-IN");

addMessage("Abhi time hai "+time,"ai");

speak("Abhi time hai "+time);

return;

}

/* YOUTUBE */

if(text.includes("youtube")){

addMessage("YouTube khol raha hoon","ai");

speak("YouTube khol raha hoon");

window.open("https://youtube.com");

return;

}

/* WHATSAPP */

if(text.includes("whatsapp")){

addMessage("WhatsApp khol raha hoon","ai");

speak("WhatsApp khol raha hoon");

window.open("https://web.whatsapp.com");

return;

}

/* GOOGLE SEARCH */

if(text.startsWith("search")){

let q=text.replace("search","");

addMessage("Google par search kar raha hoon","ai");

window.open("https://www.google.com/search?q="+encodeURIComponent(q));

return;

}

/* DEFAULT → AI */

sendToAI(text);

}

/* AI CALL */

async function sendToAI(text){

addMessage("AI soch raha hai...","ai");

try{

const res=await fetch("/api/chat",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
prompt:text
})

});

const data=await res.json();

chatBox.lastChild.remove();

if(data && data.text){

typeMessage(data.text);

speak(data.text);

}else{

addMessage("AI response nahi mila.","ai");

}

}catch{

chatBox.lastChild.remove();

addMessage("Server error.","ai");

}

}

});

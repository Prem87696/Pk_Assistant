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

/* VOICE SYSTEM */

if(SpeechRecognition){

const recognition=new SpeechRecognition();

recognition.lang="hi-IN";
recognition.continuous=true;

micBtn.onclick=()=>{
recognition.start();
addMessage("🎤 Listening...","ai");
};

recognition.onresult=(event)=>{

const text=event.results[event.results.length-1][0].transcript;

addMessage(text,"user");

detectWakeWord(text);

};

}

/* WAKE WORD */

function detectWakeWord(text){

text=text.toLowerCase();

if(text.includes(wakeWord)){

assistantActive=true;

addMessage("Ji boliye...","ai");

return;

}

if(assistantActive){

handleCommand(text);

assistantActive=false;

}

}

/* COMMAND SYSTEM */

function handleCommand(text){

text=text.toLowerCase();

/* TIME COMMAND (NO API CALL) */

if(text.includes("time") || text.includes("samay")){

const time=new Date().toLocaleTimeString("hi-IN");

addMessage("Abhi time hai "+time,"ai");

return;

}

/* YOUTUBE */

if(text.includes("youtube")){

window.open("https://youtube.com");

addMessage("YouTube khol raha hoon","ai");

return;

}

/* GOOGLE */

if(text.includes("google")){

window.open("https://google.com");

addMessage("Google open kar raha hoon","ai");

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

addMessage(data.text,"ai");

}else{

addMessage("AI response nahi mila.","ai");

}

}catch{

chatBox.lastChild.remove();

addMessage("Server error.","ai");

}

}

});

document.addEventListener("DOMContentLoaded",()=>{

/* ELEMENTS */

const openBtn=document.getElementById("openAssistant");
const panel=document.getElementById("assistantPanel");

const chatBox=document.getElementById("chat-box");
const textInput=document.getElementById("text-input");
const sendBtn=document.getElementById("send-btn");
const micBtn=document.getElementById("mic-btn");

/* ASSISTANT TOGGLE */

if(openBtn && panel){
openBtn.onclick=()=>{
panel.style.display = panel.style.display==="flex" ? "none" : "flex";
};
}

/* ADD MESSAGE */

function addMessage(text,type){

const msg=document.createElement("div");
msg.className="msg "+type;
msg.innerText=text;

chatBox.appendChild(msg);
chatBox.scrollTop=chatBox.scrollHeight;

}

/* SPEAK (VOICE OUTPUT) */

function speak(text){

const speech=new SpeechSynthesisUtterance(text);
speech.lang="hi-IN";

speechSynthesis.cancel();
speechSynthesis.speak(speech);

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

/* VOICE RECOGNITION (MOBILE SAFE) */

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;

if(SpeechRecognition){

recognition = new SpeechRecognition();

recognition.lang="hi-IN";
recognition.continuous=false;
recognition.interimResults=false;

micBtn.onclick=()=>{

addMessage("🎤 Boliyé...","ai");

setTimeout(()=>{
try{
recognition.start();
}catch(e){
console.log("mic start error",e);
}
},200);

};

/* RESULT */

recognition.onresult=(event)=>{

const text=event.results[0][0].transcript;

addMessage(text,"user");

handleCommand(text);

};

/* ERROR */

recognition.onerror=(e)=>{

addMessage("Mic error: "+e.error,"ai");

};

}else{

console.log("SpeechRecognition supported nahi hai");

}

/* COMMAND SYSTEM */

function handleCommand(text){

text=text.toLowerCase();

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

addMessage("WhatsApp Web khol raha hoon","ai");
speak("WhatsApp khol raha hoon");

window.open("https://web.whatsapp.com");

return;

}

/* GOOGLE */

if(text.includes("google")){

addMessage("Google khol raha hoon","ai");
speak("Google khol raha hoon");

window.open("https://google.com");

return;

}

/* DEFAULT → AI */

sendToAI(text);

}

/* GEMINI API CALL */

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

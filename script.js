document.addEventListener("DOMContentLoaded",()=>{

const chatBox = document.getElementById("chat-box");
const textInput = document.getElementById("text-input");
const sendBtn = document.getElementById("send-btn");
const micBtn = document.getElementById("mic-btn");

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

/* ---------- ADD MESSAGE ---------- */

function addMessage(text,type){

const msg=document.createElement("div");

msg.className="msg "+type;

msg.innerText=text;

chatBox.appendChild(msg);

chatBox.scrollTop=chatBox.scrollHeight;

}

/* ---------- TEXT SEND ---------- */

sendBtn.onclick=sendText;

textInput.addEventListener("keypress",(e)=>{
if(e.key==="Enter") sendText();
});

function sendText(){

const text=textInput.value.trim();

if(!text) return;

addMessage(text,"user");

textInput.value="";

sendToAI(text);

}

/* ---------- VOICE INPUT ---------- */

if(SpeechRecognition){

const recognition=new SpeechRecognition();

recognition.lang="hi-IN";

micBtn.onclick=()=>{
recognition.start();
};

recognition.onresult=(event)=>{

const text=event.results[0][0].transcript;

addMessage(text,"user");

sendToAI(text);

};

}

/* ---------- AI CALL ---------- */

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

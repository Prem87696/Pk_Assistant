document.addEventListener("DOMContentLoaded",()=>{

const chatBox=document.getElementById("chat-box");
const textInput=document.getElementById("text-input");
const sendBtn=document.getElementById("send-btn");
const micBtn=document.getElementById("mic-btn");

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

/* TYPING INDICATOR */

function showTyping(){

const typing=document.createElement("div");
typing.className="msg ai typing";
typing.id="typing";
typing.innerText="AI typing...";

chatBox.appendChild(typing);
chatBox.scrollTop=chatBox.scrollHeight;

}

function removeTyping(){

const t=document.getElementById("typing");
if(t) t.remove();

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

sendToAI(text);

}

/* VOICE INPUT */

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

/* AI CALL */

async function sendToAI(text){

showTyping();

try{

const res=await fetch("/api/chat",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({prompt:text})
});

const data=await res.json();

removeTyping();

if(data && data.text){

addMessage(data.text,"ai");

}else{

addMessage("AI response nahi mila.","ai");

}

}catch{

removeTyping();
addMessage("Server error.","ai");

}

}

});

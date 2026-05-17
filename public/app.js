// =========================
// MONACO EDITOR
// =========================

let editor;
// =========================
// OPEN TABS
// =========================

let openTabs = [];
require.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs"
  }
});

require(["vs/editor/editor.main"], function () {

  // =========================
  // CREATE EDITOR CONTAINER
  // =========================

  const editorContainer = document.createElement("div");

  editorContainer.id = "monaco-editor";

  editorContainer.style.height = "100%";

  editorContainer.style.width = "100%";

  document.querySelector(".editor").innerHTML = "";

  document.querySelector(".editor").appendChild(editorContainer);

  // =========================
  // MONACO EDITOR
  // =========================

  editor = monaco.editor.create(editorContainer, {

    value: `<!DOCTYPE html>
<html>
<head>
  <title>AI Dev Mentor</title>
</head>

<body>

  <h1>
    Welcome To AI Dev Mentor 🚀
  </h1>

</body>
</html>`,

    language: "html",

    theme: "vs-dark",

    fontSize: 16,

    automaticLayout: true,

    minimap: {
      enabled: true
    },

    smoothScrolling: true,

    padding: {
      top: 20
    }

  });

});

// =========================
// TERMINAL
// =========================

const terminal = document.getElementById("terminal");

function addTerminalLog(text){

  const line = document.createElement("div");

  line.innerText = text;

  terminal.appendChild(line);

  terminal.scrollTop = terminal.scrollHeight;

}

// =========================
// GENERATE BUTTON
// =========================

const generateBtn =
document.getElementById("generateBtn");

generateBtn.addEventListener("click", async ()=>{

  const prompt =
  document.getElementById("promptInput").value;

  if(!prompt){

    alert("Enter your prompt");

    return;

  }

  // =========================
  // TERMINAL LOGS
  // =========================

  addTerminalLog("> Initializing AI Agent...");

  addTerminalLog("> Understanding project architecture...");

  addTerminalLog("> Generating production code...");

  // =========================
  // DEMO AI OUTPUT
  // =========================

  setTimeout(()=>{

    editor.setValue(`<!DOCTYPE html>
<html>
<head>

  <title>AI Generated App</title>

  <style>

    body{
      background:#0f172a;
      color:white;
      font-family:sans-serif;
      display:flex;
      justify-content:center;
      align-items:center;
      height:100vh;
      margin:0;
    }

    .card{
      background:#1e293b;
      padding:40px;
      border-radius:20px;
      text-align:center;
    }

  </style>

</head>

<body>

  <div class="card">

    <h1>
      🚀 AI Generated Project
    </h1>

    <p>
      Prompt:
      ${prompt}
    </p>

  </div>

</body>
</html>`);

    addTerminalLog("> Project generated successfully.");

  },2000);

});
// =========================
// FILE SYSTEM
// =========================

const files = {

  "index.html":
`<!DOCTYPE html>
<html>
<head>
  <title>AI Dev Mentor</title>
</head>

<body>

  <h1>
    AI Dev Mentor 🚀
  </h1>

</body>
</html>`,

  "styles.css":
`body{
  background:black;
  color:white;
}`,

  "app.js":
`console.log("AI Dev Mentor");`,

  "server.js":
`const express = require("express");`

};

// =========================
// OPEN FILE
// =========================

function openFile(fileName){

  // =========================
  // ACTIVE FILE UI
  // =========================

  document
  .querySelectorAll(".file")
  .forEach(file=>{

    file.classList.remove(
      "active-file"
    );

  });

  event.target.classList.add(
    "active-file"
  );

  // =========================
  // DETECT LANGUAGE
  // =========================

  let language = "javascript";

  if(fileName.endsWith(".html")){
    language = "html";
  }

  if(fileName.endsWith(".css")){
    language = "css";
  }

  // =========================
  // SET MODEL
  // =========================

  monaco.editor.setModelLanguage(
    editor.getModel(),
    language
  );

  editor.setValue(
    files[fileName]
  );

  // =========================
  // TERMINAL
  // =========================

  addTerminalLog(
`
> Opened ${fileName}
`
  );

}

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
  // CREATE TAB
  // =========================

  if(
    !openTabs.includes(fileName)
  ){

    openTabs.push(fileName);

    createTab(fileName);

  }

  // =========================
  // ACTIVATE TAB
  // =========================

  activateTab(fileName);

}

// =========================
// CREATE TAB
// =========================

function createTab(fileName){

  const tabs =
  document.querySelector(".tabs");

  // REMOVE WELCOME TAB

  const welcome =
  document.getElementById(
    "welcomeTab"
  );

  if(welcome){

    welcome.remove();

  }

  // =========================
  // TAB
  // =========================

  const tab =
  document.createElement("div");

  tab.className = "tab";

  tab.id = "tab-" + fileName;

  tab.innerHTML = `
  
    ${fileName}
    
    <span
      onclick="
        closeTab(
          '${fileName}'
        )
      "
      style="
        margin-left:10px;
        cursor:pointer;
      "
    >
      ✕
    </span>

  `;

  tab.onclick = () => {

    activateTab(fileName);

  };

  tabs.appendChild(tab);

}

// =========================
// ACTIVATE TAB
// =========================

function activateTab(fileName){

  // =========================
  // REMOVE ACTIVE
  // =========================

  document
  .querySelectorAll(".tab")
  .forEach(tab=>{

    tab.classList.remove(
      "active"
    );

  });

  // =========================
  // ACTIVE TAB
  // =========================

  const activeTab =
  document.getElementById(
    "tab-" + fileName
  );

  if(activeTab){

    activeTab.classList.add(
      "active"
    );

  }

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
  // SET LANGUAGE
  // =========================

  monaco.editor.setModelLanguage(
    editor.getModel(),
    language
  );

  // =========================
  // LOAD FILE
  // =========================

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

// =========================
// CLOSE TAB
// =========================

function closeTab(fileName){

  event.stopPropagation();

  // =========================
  // REMOVE TAB
  // =========================

  openTabs =
  openTabs.filter(
    tab => tab !== fileName
  );

  const tab =
  document.getElementById(
    "tab-" + fileName
  );

  if(tab){

    tab.remove();

  }

  // =========================
  // EMPTY
  // =========================

  if(openTabs.length === 0){

    document
    .querySelector(".tabs")
    .innerHTML = `

      <div
        class="tab active"
        id="welcomeTab"
      >
        Welcome
      </div>

    `;

    editor.setValue("");

    return;

  }

  // =========================
  // ACTIVATE LAST TAB
  // =========================

  activateTab(
    openTabs[
      openTabs.length - 1
    ]
  );

}
// =========================
// CREATE FILE
// =========================

function createNewFile(){

  const fileName =
  prompt(
    "Enter file name"
  );

  if(!fileName){

    return;

  }

  // =========================
  // EXISTS
  // =========================

  if(files[fileName]){

    alert(
      "File already exists"
    );

    return;

  }

  // =========================
  // CREATE FILE
  // =========================

  files[fileName] = "";

  // =========================
  // FILE TREE
  // =========================

  const fileTree =
  document.getElementById(
    "fileTree"
  );

  const file =
  document.createElement("div");

  file.className = "file";

  file.innerText =
  "📄 " + fileName;

  file.onclick = () => {

    openFile(fileName);

  };

  fileTree.appendChild(file);

  // =========================
  // TERMINAL
  // =========================

  addTerminalLog(
`
> Created ${fileName}
`
  );

}

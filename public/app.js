// =========================
// MONACO EDITOR
// =========================

let editor;

// =========================
// OPEN TABS
// =========================

let openTabs = [];

// =========================
// CURRENT FILE
// =========================

let currentFile = null;

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
`import express from "express";`,

  "package.json":
`{
  "name":"ai-app",
  "version":"1.0.0"
}`,

  "README.md":
`# AI Generated Project`

};

// =========================
// MONACO CONFIG
// =========================

require.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs"
  }
});

// =========================
// INIT EDITOR
// =========================

require(["vs/editor/editor.main"], function () {

  const editorContainer =
  document.createElement("div");

  editorContainer.id =
  "monaco-editor";

  editorContainer.style.height =
  "100%";

  editorContainer.style.width =
  "100%";

  document.querySelector(
    ".editor"
  ).innerHTML = "";

  document.querySelector(
    ".editor"
  ).appendChild(editorContainer);

  // =========================
  // CREATE EDITOR
  // =========================

  editor = monaco.editor.create(
    editorContainer,
    {

      value:
      files["index.html"],

      language:"html",

      theme:"vs-dark",

      fontSize:16,

      automaticLayout:true,

      minimap:{
        enabled:true
      },

      smoothScrolling:true,

      padding:{
        top:20
      }

    }
  );

});

// =========================
// TERMINAL
// =========================

const terminal =
document.getElementById(
  "terminal"
);

function addTerminalLog(text){

  const line =
  document.createElement("div");

  line.innerText = text;

  terminal.appendChild(line);

  terminal.scrollTop =
  terminal.scrollHeight;

}

// =========================
// GENERATE BUTTON
// =========================

const generateBtn =
document.getElementById(
  "generateBtn"
);
// =========================
// CHAT SYSTEM
// =========================

const chatMessages =
document.getElementById(
  "chatMessages"
);

// =========================
// ADD MESSAGE
// =========================

function addChatMessage(
  role,
  text
){

  const message =
  document.createElement("div");

  message.className =
  `message ${
    role === "ai"
    ? "ai-message"
    : "user-message"
  }`;

  message.innerHTML = `

    <div class="message-role">

      ${
        role === "ai"
        ? "AI DEV MENTOR"
        : "YOU"
      }

    </div>

    <div class="message-content">

      ${text}

    </div>

  `;

  chatMessages.appendChild(
    message
  );

  // =========================
  // AUTO SCROLL
  // =========================

  chatMessages.scrollTop =
  chatMessages.scrollHeight;

}

// =========================
// AI GENERATION
// =========================

generateBtn.addEventListener(
  "click",
  async ()=>{

    const prompt =
    document.getElementById(
      "promptInput"
    ).value;

    if(!prompt){
// =========================
// USER MESSAGE
// =========================

addChatMessage(
  "user",
  prompt
);
      alert(
        "Enter your prompt"
      );

      return;

    }

    // =========================
    // TERMINAL
    // =========================

    addTerminalLog(
`
> Initializing AI Agent...
`
    );

    addTerminalLog(
`
> Connecting to OpenAI...
`
    );

    addTerminalLog(
`
> Generating project files...
`
    );

    try{

      // =========================
      // API
      // =========================

      const response =
      await fetch(
        "/api/ai",
        {

          method:"POST",

          headers:{
            "Content-Type":
            "application/json"
          },

          body:JSON.stringify({
            prompt
          })

        }
      );

      const data =
      await response.json();

      // =========================
      // ERROR
      // =========================

      if(!data.success){

        addTerminalLog(
`
> AI Error
`
        );

        console.log(data);

        return;

      }

      // =========================
      // PARSE JSON
      // =========================

      const aiData =
      JSON.parse(data.reply);

      // =========================
      // FILES
      // =========================

      if(aiData.files){

        aiData.files.forEach(file=>{

          // SAVE FILE

          files[file.name] =
          file.content;

          // =========================
          // EXISTS
          // =========================

          const exists =
          document.querySelector(
`
[data-file="${file.name}"]
`
          );

          // =========================
          // CREATE FILE UI
          // =========================

          if(!exists){

            const fileTree =
            document.getElementById(
              "fileTree"
            );

            const fileElement =
            document.createElement(
              "div"
            );

            fileElement.className =
            "file";

            fileElement.setAttribute(
              "data-file",
              file.name
            );

            fileElement.innerText =
            "📄 " + file.name;

            fileElement.onclick = ()=>{

              openFile(
                file.name
              );

            };

            fileTree.appendChild(
              fileElement
            );

          }

        });

        // =========================
        // OPEN FIRST FILE
        // =========================

        openFile(
          aiData.files[0].name
        );

      }

      // =========================
      // TERMINAL
      // =========================

      addTerminalLog(
`
> AI Generation Complete
`
      );

    }
// =========================
// AI SUCCESS
// =========================

addChatMessage(
  "ai",
  "✅ Project generated successfully.\nFiles, UI and preview are ready."
);
    catch(error){

      console.log(error);

      addTerminalLog(
`
> Server Error
`
      );

    }

});

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

  tab.id =
  "tab-" + fileName;

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

  tab.onclick = ()=>{

    activateTab(fileName);

  };

  tabs.appendChild(tab);

}

// =========================
// ACTIVATE TAB
// =========================

function activateTab(fileName){

  // =========================
  // CURRENT FILE
  // =========================

  currentFile = fileName;

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

  let language =
  "javascript";

  if(
    fileName.endsWith(".html")
  ){
    language = "html";
  }

  if(
    fileName.endsWith(".css")
  ){
    language = "css";
  }

  if(
    fileName.endsWith(".json")
  ){
    language = "json";
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

  file.setAttribute(
    "data-file",
    fileName
  );

  file.innerText =
  "📄 " + fileName;

  file.onclick = ()=>{

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

// =========================
// SAVE FILE
// =========================

function saveCurrentFile(){

  // =========================
  // NO FILE
  // =========================

  if(!currentFile){

    alert(
      "No file open"
    );

    return;

  }

  // =========================
  // SAVE CONTENT
  // =========================

  files[currentFile] =
  editor.getValue();

  // =========================
  // TERMINAL
  // =========================

  addTerminalLog(
`
> Saved ${currentFile}
`
  );

  // =========================
  // SUCCESS
  // =========================

  alert(
    `${currentFile} saved`
  );

}
// =========================
// LIVE PREVIEW
// =========================

function runPreview(){

  // =========================
  // HTML
  // =========================

  const html =
  files["index.html"] || "";

  // =========================
  // CSS
  // =========================

  const css =
  files["styles.css"] || "";

  // =========================
  // JS
  // =========================

  const js =
  files["app.js"] || "";

  // =========================
  // FINAL APP
  // =========================

  const finalCode = `

<!DOCTYPE html>

<html>

<head>

<style>

${css}

</style>

</head>

<body>

${html}

<script>

${js}

</script>

</body>

</html>

`;

  // =========================
  // IFRAME
  // =========================

  const iframe =
  document.getElementById(
    "previewFrame"
  );

  iframe.srcdoc =
  finalCode;

  // =========================
  // TERMINAL
  // =========================

  addTerminalLog(
`
> Live Preview Running
`
  );

}

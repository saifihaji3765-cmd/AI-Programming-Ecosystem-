/* =========================
   GLOBAL STATE
========================= */

let historyData = JSON.parse(
  localStorage.getItem("ai_history")
) || [];

let activeProject = null;

/* =========================
   SAVE HISTORY
========================= */

function saveHistory(
  title,
  content
){

  historyData.unshift({

    title,
    content

  });

  localStorage.setItem(

    "ai_history",

    JSON.stringify(
      historyData
    )

  );

  renderHistory();

}

/* =========================
   RENDER HISTORY
========================= */

function renderHistory(){

  const list =
    document.getElementById(
      "historyList"
    );

  if(!list) return;

  list.innerHTML = "";

  historyData.forEach(item => {

    const div =
      document.createElement("div");

    div.className =
      "history-item";

    div.innerText =
      item.title;

    div.onclick = () => {

      streamHTML(
        item.content
      );

    };

    list.appendChild(div);

  });

}

/* =========================
   CLEAR HISTORY
========================= */

function clearHistory(){

  localStorage.removeItem(
    "ai_history"
  );

  historyData = [];

  renderHistory();

}

/* =========================
   COPY CODE
========================= */

function copyCode(id){

  const text =
    document.getElementById(id)
    .innerText;

  navigator.clipboard
    .writeText(text);

  alert("Copied");

}

/* =========================
   STREAM HTML
========================= */

async function streamHTML(html){

  const chat =
    document.getElementById(
      "chat"
    );

  const div =
    document.createElement("div");

  div.className =
    "message";

  chat.appendChild(div);

  let i = 0;

  const speed = 4;

  function type(){

    if(i < html.length){

      div.innerHTML =
        html.slice(0, i);

      i += speed;

      chat.scrollTop =
        chat.scrollHeight;

      requestAnimationFrame(type);

    }

  }

  type();

}

/* =========================
   WORKFLOW SUGGESTIONS
========================= */

function updateWorkflowSuggestions(
  projectName
){

  const steps =
    document.getElementById(
      "workflowSteps"
    );

  if(!steps) return;

  if(!projectName){

    steps.innerHTML =
      "No suggestions yet";

    return;

  }

  steps.innerHTML = `

    <div class="file-item">
      ✔ Add authentication
    </div>

    <div class="file-item">
      ✔ Improve architecture
    </div>

    <div class="file-item">
      ✔ Add deployment
    </div>

    <div class="file-item">
      ✔ Add testing
    </div>

  `;

}

/* =========================
   LOAD ACTIVE PROJECT
========================= */

async function loadActiveProject(){

  try {

    const res =
      await fetch(
        "/get-project-memory"
      );

    const data =
      await res.json();

    if(
      data &&
      data.projectName
    ){

      activeProject =
        data;

      document.getElementById(
        "activeProjectName"
      ).innerText =
        data.projectName;

      renderFileExplorer(
        data.files || []
      );

      updateWorkflowSuggestions(
        data.projectName
      );

    }

  } catch(err){

    console.log(err);

  }

}

/* =========================
   RUN AI
========================= */

async function runAI(){

  const prompt =
    document.getElementById(
      "prompt"
    ).value;

  const mode =
    document.getElementById(
      "mode"
    ).value;

  const language =
    document.getElementById(
      "language"
    ).value;

  streamHTML(`

    <div class="section-title">
      🧠 AI Thinking...
    </div>

  `);

  /* =========================
     ANALYZE
  ========================= */

  if(mode === "analyze"){

    const res =
      await fetch(
        "/analyze",
        {

          method:"POST",

          headers:{
            "Content-Type":
            "application/json"
          },

          body:JSON.stringify({

            code:prompt,
            language

          })

        }
      );

    const data =
      await res.json();

    const codeId =
      "fix_" + Date.now();

    const html = `

      <div class="section">

        <div class="section-title">
          🐞 Problems
        </div>

        <pre>
${(data.issues || []).join("\n\n")}
        </pre>

      </div>

      <div class="section">

        <div class="section-title">
          ⚡ Fixes
        </div>

        <pre>
${(data.fixes || []).join("\n\n")}
        </pre>

      </div>

      <div class="section">

        <div class="section-title">
          📘 Explanation
        </div>

        <pre>
${(data.explanation || []).join("\n\n")}
        </pre>

      </div>

      <div class="section">

        <div class="section-title">
          💻 Fixed Code
        </div>

        <div class="code-box">

          <div class="code-top">

            <div>
              ${language}
            </div>

            <button
              class="copy-btn"
              onclick="copyCode('${codeId}')"
            >
              Copy
            </button>

          </div>

          <pre id="${codeId}">
${data.fixedCode || ""}
          </pre>

        </div>

      </div>

    `;

    streamHTML(html);

    saveHistory(
      "💻 Analysis",
      html
    );

  }

}

/* =========================
   INIT
========================= */

renderHistory();

loadActiveProject();

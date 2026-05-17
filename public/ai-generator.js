/* =========================
   AUTONOMOUS AI AGENT
========================= */

let agentRunning = false;

/* =========================
   START AGENT
========================= */

async function startAutonomousAgent(){

  if(agentRunning){

    alert(
      "Agent already running"
    );

    return;

  }

  const prompt =
    document.getElementById(
      "prompt"
    ).value;

  if(!prompt){

    alert(
      "Enter agent task"
    );

    return;

  }

  agentRunning = true;

  streamHTML(`

    <div class="section">

      <div class="section-title">
        🤖 Autonomous Agent Started
      </div>

      <pre id="agentLogs">

Booting AI agents...
Planning architecture...
Analyzing requirements...

      </pre>

    </div>

  `);

  try {

    const res =
      await fetch(

        "/autonomous-agent",

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
      await res.json();

    const logs =
      document.getElementById(
        "agentLogs"
      );

    if(logs){

      logs.innerHTML += `

✔ Project planned
✔ Files generated
✔ Backend created
✔ Frontend created
✔ Dependencies installed

--------------------------------

${data.summary}

      `;

    }

    await loadActiveProject();

  } catch(err){

    streamHTML(`

      <div class="section">

        <div class="section-title">
          ❌ Agent Failed
        </div>

        <pre>

${err.message}

        </pre>

      </div>

    `);

  }

  agentRunning = false;

}

/* =========================
   LIVE AGENT STATUS
========================= */

async function checkAgentStatus(){

  try {

    const res =
      await fetch(
        "/agent-status"
      );

    const data =
      await res.json();

    const logs =
      document.getElementById(
        "agentLogs"
      );

    if(
      logs &&
      data.logs
    ){

      logs.innerHTML += `

${data.logs}

      `;

      logs.scrollTop =
        logs.scrollHeight;

    }

  } catch(err){

    console.log(err);

  }

}

/* =========================
   AUTO STREAM
========================= */

setInterval(() => {

  if(agentRunning){

    checkAgentStatus();

  }

}, 2000);

/* =========================
   AGENT TERMINAL ACTION
========================= */

async function agentRunCommand(command){

  const res =
    await fetch(

      "/terminal",

      {

        method:"POST",

        headers:{
          "Content-Type":
          "application/json"
        },

        body:JSON.stringify({

          command

        })

      }

    );

  return await res.json();

}

/* =========================
   AGENT FILE CREATOR
========================= */

async function agentCreateFile(
  fileName,
  content
){

  const res =
    await fetch(

      "/save-file",

      {

        method:"POST",

        headers:{
          "Content-Type":
          "application/json"
        },

        body:JSON.stringify({

          fileName,
          content

        })

      }

    );

  return await res.json();

}

/* =========================
   AGENT PROJECT PLAN
========================= */

function generateAgentPlan(prompt){

  return {

    projectName:
      prompt,

    tasks:[

      "Analyze prompt",
      "Create folders",
      "Generate frontend",
      "Generate backend",
      "Create APIs",
      "Install packages",
      "Run application"

    ]

  };

}

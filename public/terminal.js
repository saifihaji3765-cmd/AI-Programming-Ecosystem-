/* =========================
   TERMINAL SYSTEM
========================= */

let terminalRunning = false;

/* =========================
   OPEN TERMINAL
========================= */

function openTerminal(){

  const html = `

    <div class="section">

      <div class="section-title">
        🖥 Terminal
      </div>

      <div
        id="terminalOutput"
        class="terminal-box"
      >

        AI Dev Terminal Ready...
        <br/>
        -------------------------
        <br/>

      </div>

      <div
        style="
          display:flex;
          gap:10px;
          margin-top:15px;
        "
      >

        <input

          id="terminalInput"

          placeholder="Enter command..."

          style="
            flex:1;
            padding:14px;
            border:none;
            outline:none;
            border-radius:10px;
            background:#111827;
            color:white;
          "

          onkeydown="
            if(event.key==='Enter'){
              runTerminalCommand();
            }
          "

        />

        <button
          onclick="runTerminalCommand()"
        >
          ▶ Run
        </button>

      </div>

    </div>

  `;

  document.getElementById(
    "chat"
  ).innerHTML = html;

}

/* =========================
   RUN COMMAND
========================= */

async function runTerminalCommand(){

  if(terminalRunning){

    return;

  }

  const input =
    document.getElementById(
      "terminalInput"
    );

  const output =
    document.getElementById(
      "terminalOutput"
    );

  const command =
    input.value.trim();

  if(!command){

    return;

  }

  terminalRunning = true;

  output.innerHTML += `

    <br/>
    <span style="color:#60a5fa;">
      ➜ ${command}
    </span>
    <br/>

  `;

  input.value = "";

  try {

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

    const data =
      await res.json();

    output.innerHTML += `

      ${data.output}
      <br/><br/>

    `;

  } catch(err){

    output.innerHTML += `

      <span style="color:red;">
        Terminal Error
      </span>

    `;

  }

  output.scrollTop =
    output.scrollHeight;

  terminalRunning = false;

}

/* =========================
   TERMINAL STREAM
========================= */

async function streamTerminalOutput(){

  const output =
    document.getElementById(
      "terminalOutput"
    );

  if(!output){

    return;

  }

  try {

    const res =
      await fetch(
        "/terminal-stream"
      );

    const data =
      await res.json();

    if(data.output){

      output.innerHTML += `

        ${data.output}
        <br/>

      `;

      output.scrollTop =
        output.scrollHeight;

    }

  } catch(err){

    console.log(err);

  }

}

/* =========================
   AUTO STREAM
========================= */

setInterval(() => {

  streamTerminalOutput();

}, 2000);

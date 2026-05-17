/* =========================
   PROFESSIONAL TERMINAL UI
========================= */

function openTerminalPanel(){

  const chat =
    document.getElementById(
      "chat"
    );

  chat.innerHTML = `

    <div class="section">

      <div
        style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:15px;
        "
      >

        <div class="section-title">
          🖥 AI Terminal
        </div>

        <button
          onclick="clearTerminal()"
        >
          🗑 Clear
        </button>

      </div>

      <div
        id="terminalOutput"
        class="terminal-box"
      >

AI Dev Terminal Ready...
--------------------------------

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

          placeholder="Enter terminal command..."

          style="
            flex:1;
            padding:14px;
            border:none;
            outline:none;
            border-radius:10px;
            background:#111827;
            color:white;
            font-size:14px;
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

}

/* =========================
   CLEAR TERMINAL
========================= */

function clearTerminal(){

  const terminal =
    document.getElementById(
      "terminalOutput"
    );

  if(terminal){

    terminal.innerHTML = `
AI Dev Terminal Ready...
--------------------------------
`;

  }

}

/* =========================
   QUICK COMMANDS
========================= */

function runQuickCommand(
  command
){

  const input =
    document.getElementById(
      "terminalInput"
    );

  if(input){

    input.value =
      command;

    runTerminalCommand();

  }

}

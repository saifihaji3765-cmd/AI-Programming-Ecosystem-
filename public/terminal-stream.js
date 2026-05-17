/* =========================
   LIVE TERMINAL STREAM
========================= */

let terminalInterval = null;

/* =========================
   START STREAM
========================= */

function startTerminalStream(){

  if(terminalInterval){

    clearInterval(
      terminalInterval
    );

  }

  terminalInterval =
    setInterval(

      async () => {

        try {

          const res =
            await fetch(
              "/terminal-stream"
            );

          const data =
            await res.json();

          if(
            data.output
          ){

            appendTerminalOutput(
              data.output
            );

          }

        } catch(err){

          console.log(err);

        }

      },

      1000

    );

}

/* =========================
   APPEND OUTPUT
========================= */

function appendTerminalOutput(
  text
){

  const terminal =
    document.getElementById(
      "terminalOutput"
    );

  if(!terminal) return;

  terminal.innerHTML += `

${text}

  `;

  terminal.scrollTop =
    terminal.scrollHeight;

}

/* =========================
   RUN COMMAND
========================= */

async function runTerminalCommand(){

  const input =
    document.getElementById(
      "terminalInput"
    );

  const command =
    input.value;

  if(!command){

    return;

  }

  appendTerminalOutput(
`
> ${command}
`
  );

  input.value = "";

  try {

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

  } catch(err){

    appendTerminalOutput(
      err.message
    );

  }

}

/* =========================
   AUTO START
========================= */

startTerminalStream();

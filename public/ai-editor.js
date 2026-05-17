/* =========================
   AI SELF FILE EDITOR
========================= */

async function aiEditProject(){

  const prompt =
    document.getElementById(
      "prompt"
    ).value;

  if(!prompt){

    alert(
      "Enter editing task"
    );

    return;

  }

  streamHTML(`

    <div class="section">

      <div class="section-title">
        🤖 AI Editing Project
      </div>

      <pre id="aiEditLogs">

Scanning workspace...
Reading files...
Planning modifications...

      </pre>

    </div>

  `);

  try {

    const res =
      await fetch(

        "/ai-edit-project",

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
        "aiEditLogs"
      );

    if(logs){

      logs.innerHTML += `

✔ Files analyzed
✔ Changes generated
✔ Project updated

--------------------------------

${data.summary}

      `;

    }

    await loadActiveProject();

  } catch(err){

    streamHTML(`

      <div class="section">

        <div class="section-title">
          ❌ AI Edit Failed
        </div>

        <pre>

${err.message}

        </pre>

      </div>

    `);

  }

}

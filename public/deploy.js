/* =========================
   ONE CLICK DEPLOY
========================= */

async function deployProject(){

  streamHTML(`

    <div class="section">

      <div class="section-title">
        🚀 Deploy Started
      </div>

      <pre id="deployLogs">

Preparing project...
Analyzing build...
Creating deployment package...

      </pre>

    </div>

  `);

  try {

    const res =
      await fetch(

        "/deploy-project",

        {

          method:"POST"

        }

      );

    const data =
      await res.json();

    const logs =
      document.getElementById(
        "deployLogs"
      );

    if(logs){

      logs.innerHTML += `

✔ Build completed
✔ Deployment ready
✔ Live URL created

--------------------------------

🌍 URL:
${data.url}

      `;

    }

    window.open(
      data.url,
      "_blank"
    );

  } catch(err){

    streamHTML(`

      <div class="section">

        <div class="section-title">
          ❌ Deploy Failed
        </div>

        <pre>

${err.message}

        </pre>

      </div>

    `);

  }

}

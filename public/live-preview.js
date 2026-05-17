/* =========================
   LIVE PREVIEW ENGINE
========================= */

let previewWindow = null;

/* =========================
   OPEN PREVIEW
========================= */

async function openLivePreview(){

  streamHTML(`

    <div class="section">

      <div class="section-title">
        🚀 Starting Preview
      </div>

      <pre>

Launching app...
Starting server...
Preparing live preview...

      </pre>

    </div>

  `);

  try {

    const res =
      await fetch(

        "/start-preview",

        {

          method:"POST"

        }

      );

    const data =
      await res.json();

    if(data.success){

      streamHTML(`

        <div class="section">

          <div class="section-title">
            🌍 Live Preview Ready
          </div>

          <pre>

${data.url}

          </pre>

        </div>

      `);

      previewWindow =
        window.open(
          data.url,
          "_blank"
        );

    }

  } catch(err){

    streamHTML(`

      <div class="section">

        <div class="section-title">
          ❌ Preview Failed
        </div>

        <pre>

${err.message}

        </pre>

      </div>

    `);

  }

}

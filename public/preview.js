/* =========================
   LIVE PREVIEW SYSTEM
========================= */

let previewWindow = null;

/* =========================
   OPEN PREVIEW
========================= */

function openPreview(){

  const html = `

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
          🌐 Live Preview
        </div>

        <button
          onclick="refreshPreview()"
        >
          🔄 Refresh
        </button>

      </div>

      <iframe
        id="previewFrame"
      ></iframe>

    </div>

  `;

  document.getElementById(
    "chat"
  ).innerHTML = html;

  renderPreview();

}

/* =========================
   RENDER PREVIEW
========================= */

function renderPreview(){

  const iframe =
    document.getElementById(
      "previewFrame"
    );

  if(!iframe){

    return;

  }

  if(
    !activeProject ||
    !activeProject.files
  ){

    iframe.srcdoc = `

      <h1
        style="
          font-family:Arial;
          padding:30px;
        "
      >
        No project loaded
      </h1>

    `;

    return;

  }

  /* =========================
     FIND INDEX.HTML
  ========================= */

  const indexFile =
    activeProject.files.find(

      file =>
      file.name === "index.html"

    );

  if(!indexFile){

    iframe.srcdoc = `

      <h1
        style="
          font-family:Arial;
          padding:30px;
        "
      >
        index.html not found
      </h1>

    `;

    return;

  }

  /* =========================
     LOAD HTML
  ========================= */

  iframe.srcdoc =
    indexFile.content;

}

/* =========================
   REFRESH PREVIEW
========================= */

function refreshPreview(){

  renderPreview();

}

/* =========================
   AUTO REFRESH
========================= */

setInterval(() => {

  const iframe =
    document.getElementById(
      "previewFrame"
    );

  if(iframe){

    renderPreview();

  }

}, 5000);

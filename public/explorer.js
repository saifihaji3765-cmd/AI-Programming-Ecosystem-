/* =========================
   FILE EXPLORER
========================= */

function renderFileExplorer(files){

  const explorer =
    document.getElementById(
      "fileExplorer"
    );

  if(!explorer) return;

  explorer.innerHTML = "";

  /* =========================
     EMPTY
  ========================= */

  if(
    !files ||
    files.length === 0
  ){

    explorer.innerHTML = `

      <div class="file-item">
        No files yet
      </div>

    `;

    return;

  }

  /* =========================
     ACTION BUTTONS
  ========================= */

  const actions =
    document.createElement("div");

  actions.innerHTML = `

    <button
      style="
        width:100%;
        margin-bottom:10px;
      "
      onclick="createNewFile()"
    >
      ➕ New File
    </button>

    <button
      style="
        width:100%;
        margin-bottom:15px;
      "
      onclick="createNewFolder()"
    >
      📁 New Folder
    </button>

  `;

  explorer.appendChild(actions);

  /* =========================
     FILES
  ========================= */

  files.forEach(file => {

    const div =
      document.createElement("div");

    div.className =
      "file-item";

    div.innerHTML = `

      <div
        style="
          display:flex;
          justify-content:space-between;
          align-items:center;
        "
      >

        <span>
          ${
            file.type === "folder"
            ? "📁"
            : "📄"
          }

          ${file.name}
        </span>

        <span>

          <button

            style="
              padding:5px 8px;
              font-size:12px;
              margin-right:5px;
            "

            onclick="
              event.stopPropagation();
              renameFile(
                '${file.name}'
              )
            "

          >
            ✏
          </button>

          <button

            style="
              padding:5px 8px;
              font-size:12px;
              background:#dc2626;
            "

            onclick="
              event.stopPropagation();
              deleteFile(
                '${file.name}'
              )
            "

          >
            🗑
          </button>

        </span>

      </div>

    `;

    div.onclick = () => {

      if(
        file.type === "folder"
      ){

        return;

      }

      openFileTab(file);

    };

    explorer.appendChild(div);

  });

}

/* =========================
   CREATE FILE
========================= */

async function createNewFile(){

  const name =
    prompt(
      "Enter file name"
    );

  if(!name) return;

  const res =
    await fetch(

      "/create-file",

      {

        method:"POST",

        headers:{
          "Content-Type":
          "application/json"
        },

        body:JSON.stringify({

          name

        })

      }

    );

  const data =
    await res.json();

  if(data.success){

    loadActiveProject();

  }

}

/* =========================
   CREATE FOLDER
========================= */

async function createNewFolder(){

  const name =
    prompt(
      "Enter folder name"
    );

  if(!name) return;

  const res =
    await fetch(

      "/create-folder",

      {

        method:"POST",

        headers:{
          "Content-Type":
          "application/json"
        },

        body:JSON.stringify({

          name

        })

      }

    );

  const data =
    await res.json();

  if(data.success){

    loadActiveProject();

  }

}

/* =========================
   DELETE FILE
========================= */

async function deleteFile(name){

  const confirmDelete =
    confirm(

      `Delete ${name} ?`

    );

  if(!confirmDelete){

    return;

  }

  const res =
    await fetch(

      "/delete-file",

      {

        method:"POST",

        headers:{
          "Content-Type":
          "application/json"
        },

        body:JSON.stringify({

          name

        })

      }

    );

  const data =
    await res.json();

  if(data.success){

    loadActiveProject();

  }

}

/* =========================
   RENAME FILE
========================= */

async function renameFile(oldName){

  const newName =
    prompt(
      "New name",
      oldName
    );

  if(!newName) return;

  const res =
    await fetch(

      "/rename-file",

      {

        method:"POST",

        headers:{
          "Content-Type":
          "application/json"
        },

        body:JSON.stringify({

          oldName,
          newName

        })

      }

    );

  const data =
    await res.json();

  if(data.success){

    loadActiveProject();

  }

}

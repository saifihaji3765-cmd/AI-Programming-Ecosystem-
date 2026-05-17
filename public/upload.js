/* =========================
   FILE UPLOAD
========================= */

async function uploadFile(
  file
){

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  try {

    const res =
      await fetch(

        "/upload",

        {

          method:"POST",

          body:formData

        }

      );

    const data =
      await res.json();

    if(data.success){

      streamHTML(`

        <div class="section">

          <div class="section-title">
            📁 File Uploaded
          </div>

          <pre>

${file.name}

          </pre>

        </div>

      `);

      loadActiveProject();

    }

  } catch(err){

    console.log(err);

  }

}

/* =========================
   DRAG DROP
========================= */

function setupDragDrop(){

  document.addEventListener(

    "dragover",

    (e) => {

      e.preventDefault();

    }

  );

  document.addEventListener(

    "drop",

    async (e) => {

      e.preventDefault();

      const files =
        e.dataTransfer.files;

      for(
        const file
        of files
      ){

        await uploadFile(
          file
        );

      }

    }

  );

}

/* =========================
   INIT
========================= */

setupDragDrop();

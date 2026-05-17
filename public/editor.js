/* =========================
   MONACO EDITOR
========================= */

let editor = null;

/* =========================
   INITIALIZE EDITOR
========================= */

function initializeEditor(file){

  require.config({

    paths:{

      vs:
      "https://unpkg.com/monaco-editor@0.44.0/min/vs"

    }

  });

  require(

    ["vs/editor/editor.main"],

    function(){

      if(editor){

        editor.dispose();

      }

      editor =
        monaco.editor.create(

          document.getElementById(
            "editorMount"
          ),

          {

            value:
              file.content || "",

            language:
              detectLanguage(
                file.name
              ),

            theme:
              "vs-dark",

            automaticLayout:
              true,

            fontSize:
              14,

            minimap:{
              enabled:true
            },

            scrollBeyondLastLine:
              false,

            roundedSelection:
              true

          }

        );

    }

  );

}

/* =========================
   DETECT LANGUAGE
========================= */

function detectLanguage(fileName){

  if(fileName.endsWith(".js")){

    return "javascript";

  }

  if(fileName.endsWith(".html")){

    return "html";

  }

  if(fileName.endsWith(".css")){

    return "css";

  }

  if(fileName.endsWith(".json")){

    return "json";

  }

  if(fileName.endsWith(".py")){

    return "python";

  }

  if(fileName.endsWith(".java")){

    return "java";

  }

  if(fileName.endsWith(".cpp")){

    return "cpp";

  }

  return "javascript";

}

/* =========================
   SAVE CURRENT FILE
========================= */

async function saveCurrentFile(){

  if(
    !editor ||
    !activeTab
  ) return;

  const content =
    editor.getValue();

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

          fileName:
            activeTab,

          content

        })

      }

    );

  const data =
    await res.json();

  if(data.success){

    alert(
      "✅ File Saved"
    );

  } else {

    alert(
      "❌ Save Failed"
    );

  }

}

/* =========================
   AUTO SAVE
========================= */

setInterval(() => {

  if(
    editor &&
    activeTab
  ){

    saveCurrentFile();

  }

}, 30000);

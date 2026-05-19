// =========================
// FILE MANAGER AGENT
// =========================

const path =
require("path");

// =========================
// FILE MANAGER
// =========================

async function fileManagerAgent(

  projectFiles

){

  // =========================
  // STRUCTURE
  // =========================

  const folders = {

    frontend:[],

    backend:[],

    database:[],

    config:[],

    assets:[],

    docs:[],

    misc:[]

  };

  // =========================
  // LOOP FILES
  // =========================

  for(

    const file
    of projectFiles

  ){

    const fileName =
    file.name.toLowerCase();

    // =========================
    // FRONTEND
    // =========================

    if(

      fileName.endsWith(".html") ||

      fileName.endsWith(".css") ||

      fileName.endsWith(".jsx") ||

      fileName.endsWith(".tsx")

    ){

      folders.frontend.push(
        file.name
      );

    }

    // =========================
    // BACKEND
    // =========================

    else if(

      fileName.endsWith(".js") ||

      fileName.endsWith(".ts")

    ){

      folders.backend.push(
        file.name
      );

    }

    // =========================
    // DATABASE
    // =========================

    else if(

      fileName.includes("schema") ||

      fileName.includes("model") ||

      fileName.includes("database")

    ){

      folders.database.push(
        file.name
      );

    }

    // =========================
    // CONFIG
    // =========================

    else if(

      fileName.includes("package") ||

      fileName.includes(".env") ||

      fileName.includes("config")

    ){

      folders.config.push(
        file.name
      );

    }

    // =========================
    // ASSETS
    // =========================

    else if(

      fileName.endsWith(".png") ||

      fileName.endsWith(".jpg") ||

      fileName.endsWith(".svg")

    ){

      folders.assets.push(
        file.name
      );

    }

    // =========================
    // DOCS
    // =========================

    else if(

      fileName.endsWith(".md")

    ){

      folders.docs.push(
        file.name
      );

    }

    // =========================
    // MISC
    // =========================

    else {

      folders.misc.push(
        file.name
      );

    }

  }

  // =========================
  // STRUCTURE PLAN
  // =========================

  const structurePlan = {

    rootFolders:[

      "client",

      "server",

      "database",

      "public",

      "docs"

    ],

    categorizedFiles:
    folders,

    scalable:true,

    productionReady:true

  };

  // =========================
  // RETURN
  // =========================

  return structurePlan;

}

// =========================
// EXPORT
// =========================

module.exports =
fileManagerAgent;

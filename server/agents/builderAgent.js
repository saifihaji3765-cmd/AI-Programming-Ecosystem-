// =========================
// BUILDER AGENT
// =========================

export async function generateFiles(plan){

  // =========================
  // FILES ARRAY
  // =========================

  const files = [];

  // =========================
  // INDEX HTML
  // =========================

  files.push({

    name:"index.html",

    content:`

<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    ${plan.projectName}
  </title>

  <link
    rel="stylesheet"
    href="styles.css"
  />

</head>

<body>

  <div class="app">

    <h1>
      ${plan.projectName}
    </h1>

    <p>
      AI Generated Platform
    </p>

  </div>

  <script src="app.js"></script>

</body>

</html>

`

  });

  // =========================
  // STYLES
  // =========================

  files.push({

    name:"styles.css",

    content:`

body{

  margin:0;

  background:#0a0a0a;

  color:white;

  font-family:sans-serif;

}

.app{

  display:flex;

  flex-direction:column;

  justify-content:center;

  align-items:center;

  height:100vh;

}

h1{

  font-size:60px;

}

`

  });

  // =========================
  // APP JS
  // =========================

  files.push({

    name:"app.js",

    content:`

console.log(
  "${plan.projectName}"
);

`

  });

  // =========================
  // SERVER
  // =========================

  files.push({

    name:"server.js",

    content:`

import express from "express";

const app = express();

app.use(
  express.json()
);

app.get("/",(req,res)=>{

  res.send(
    "Server Running"
  );

});

app.listen(3000,()=>{

  console.log(
    "Server Started"
  );

});

`

  });

  // =========================
  // PACKAGE JSON
  // =========================

  files.push({

    name:"package.json",

    content:`

{
  "name":"ai-project",

  "version":"1.0.0",

  "type":"module",

  "scripts":{

    "start":"node server.js"

  },

  "dependencies":{

    "express":"^4.18.2"

  }

}

`

  });

  // =========================
  // RETURN FILES
  // =========================

  return files;

}

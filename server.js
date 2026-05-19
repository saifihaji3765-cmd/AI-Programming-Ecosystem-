// =========================
// IMPORTS
// =========================

require("dotenv").config();

const express =
require("express");

const cors =
require("cors");

const fs =
require("fs");

const path =
require("path");

const bodyParser =
require("body-parser");

const OpenAI =
require("openai");

// =========================
// OPENAI
// =========================

const openai =
new OpenAI({

  apiKey:
  process.env.OPENAI_API_KEY

});

// =========================
// EXPRESS
// =========================

const app =
express();

const PORT =
3000;

// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(
  bodyParser.json({
    limit:"50mb"
  })
);

// =========================
// PUBLIC FOLDER
// =========================

app.use(
  express.static(
    path.join(
      __dirname,
      "public"
    )
  )
);

// =========================
// WORKSPACE
// =========================

const WORKSPACE =
path.join(
  __dirname,
  "workspace"
);

if(
  !fs.existsSync(
    WORKSPACE
  )
){

  fs.mkdirSync(
    WORKSPACE
  );

}

// =========================
// PROJECT MEMORY
// =========================

let activeProject = {

  projectName:
  "AI Workspace",

  files:[]

};

// =========================
// AGENT LOGS
// =========================

let agentLogs = "";

// =========================
// LOAD FILES
// =========================

function loadWorkspaceFiles(){

  function readDir(dir){

    const items =
    fs.readdirSync(dir);

    let results = [];

    for(
      const item
      of items
    ){

      const itemPath =
      path.join(
        dir,
        item
      );

      const stat =
      fs.statSync(
        itemPath
      );

      const relative =
      path.relative(
        WORKSPACE,
        itemPath
      );

      // =========================
      // FOLDER
      // =========================

      if(
        stat.isDirectory()
      ){

        results.push({

          name:relative,

          type:"folder",

          content:""

        });

        results =
        results.concat(
          readDir(itemPath)
        );

      }

      // =========================
      // FILE
      // =========================

      else {

        results.push({

          name:relative,

          type:"file",

          content:
          fs.readFileSync(
            itemPath,
            "utf-8"
          )

        });

      }

    }

    return results;

  }

  activeProject.files =
  readDir(WORKSPACE);

}

loadWorkspaceFiles();

// =========================
// GET PROJECT
// =========================

app.get(

  "/get-project-memory",

  (req,res)=>{

    loadWorkspaceFiles();

    res.json(
      activeProject
    );

  }

);

// =========================
// SAVE FILE
// =========================

app.post(

  "/save-file",

  (req,res)=>{

    try{

      const {
        fileName,
        content
      } = req.body;

      const filePath =
      path.join(
        WORKSPACE,
        fileName
      );

      const dir =
      path.dirname(
        filePath
      );

      if(
        !fs.existsSync(dir)
      ){

        fs.mkdirSync(
          dir,
          {
            recursive:true
          }
        );

      }

      fs.writeFileSync(
        filePath,
        content
      );

      loadWorkspaceFiles();

      res.json({

        success:true

      });

    }

    catch(err){

      res.status(500).json({

        success:false,

        error:err.message

      });

    }

  }

);

// =========================
// CREATE FILE
// =========================

app.post(

  "/create-file",

  (req,res)=>{

    try{

      const {
        name
      } = req.body;

      const filePath =
      path.join(
        WORKSPACE,
        name
      );

      const dir =
      path.dirname(
        filePath
      );

      if(
        !fs.existsSync(dir)
      ){

        fs.mkdirSync(
          dir,
          {
            recursive:true
          }
        );

      }

      fs.writeFileSync(
        filePath,
        ""
      );

      loadWorkspaceFiles();

      res.json({

        success:true

      });

    }

    catch(err){

      res.status(500).json({

        success:false

      });

    }

  }

);

// =========================
// AI GENERATION
// =========================

app.post(

  "/api/ai",

  async (req,res)=>{

    try{

      const {
        prompt
      } = req.body;

      agentLogs = `
🤖 AI Started...
`;

      // =========================
      // LOAD FILES
      // =========================

      loadWorkspaceFiles();

      const projectFiles =
      activeProject.files
      .filter(
        file =>
        file.type === "file"
      )
      .map(file => ({

        name:file.name,

        content:file.content

      }));

      // =========================
      // OPENAI
      // =========================

      const completion =
      await openai.chat.completions.create({

        model:
        "gpt-4.1-mini",

        messages:[

          {

            role:"system",

            content:`

You are a world class autonomous AI software engineer.

Your job:

1. Understand bad prompts
2. Convert them into professional architecture
3. Generate production-ready projects
4. Create scalable UI/UX
5. Fix bugs automatically
6. Generate complete files

IMPORTANT:

Return ONLY valid JSON.

Format:

{
  "projectName":"",
  "summary":"",
  "files":[
    {
      "name":"",
      "content":""
    }
  ]
}

Rules:

- No markdown
- No explanations
- No triple backticks
- Always complete code
- Always production ready

            `

          },

          {

            role:"user",

            content:`

USER IDEA:

${prompt}

CURRENT PROJECT:

${JSON.stringify(
  projectFiles
)}

            `

          }

        ],

        temperature:0.4

      });

      // =========================
      // AI RESPONSE
      // =========================

      const text =
      completion
      .choices[0]
      .message
      .content;

      const cleaned =
      text
      .replace(/```json/g,"")
      .replace(/```/g,"")
      .trim();

      const parsed =
      JSON.parse(
        cleaned
      );

      // =========================
      // SAVE FILES
      // =========================

      for(
        const file
        of parsed.files
      ){

        const filePath =
        path.join(
          WORKSPACE,
          file.name
        );

        const dir =
        path.dirname(
          filePath
        );

        if(
          !fs.existsSync(dir)
        ){

          fs.mkdirSync(
            dir,
            {
              recursive:true
            }
          );

        }

        fs.writeFileSync(

          filePath,

          file.content || ""

        );

      }

      loadWorkspaceFiles();

      agentLogs = `
🚀 AI Build Complete
`;

      // =========================
      // RESPONSE
      // =========================

      res.json({

        success:true,

        reply:JSON.stringify(
          parsed
        )

      });

    }

    catch(err){

      console.log(err);

      res.status(500).json({

        success:false,

        error:err.message

      });

    }

  }

);

// =========================
// AGENT STATUS
// =========================

app.get(

  "/agent-status",

  (req,res)=>{

    res.json({

      logs:agentLogs

    });

  }

);

// =========================
// ROOT
// =========================

app.get(

  "/",

  (req,res)=>{

    res.sendFile(

      path.join(

        __dirname,

        "public",

        "index.html"

      )

    );

  }

);

// =========================
// START SERVER
// =========================

app.listen(

  PORT,

  ()=>{

    console.log(`

🚀 AI DEV MENTOR RUNNING

🌐 http://localhost:${PORT}

🤖 AI SYSTEM:
ONLINE

    `);

  }

);

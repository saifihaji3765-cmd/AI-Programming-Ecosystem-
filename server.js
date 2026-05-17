/* =========================
   IMPORTS
========================= */

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

const { exec } =
  require("child_process");

const OpenAI =
  require("openai");

/* =========================
   OPENAI
========================= */

const openai =
  new OpenAI({

    apiKey:
      process.env.OPENAI_API_KEY

  });

/* =========================
   APP
========================= */

const app =
  express();

const PORT =
  3000;

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(
  bodyParser.json({
    limit:"50mb"
  })
);

app.use(
  express.static(
    path.join(
      __dirname,
      "public"
    )
  )
);

/* =========================
   WORKSPACE
========================= */

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

/* =========================
   ACTIVE PROJECT
========================= */

let activeProject = {

  projectName:
    "AI Workspace",

  files:[]

};

/* =========================
   AGENT LOGS
========================= */

let agentLogs = "";

/* =========================
   LOAD WORKSPACE FILES
========================= */

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

      /* =========================
         FOLDER
      ========================= */

      if(stat.isDirectory()){

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

      /* =========================
         FILE
      ========================= */

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

/* =========================
   GET PROJECT MEMORY
========================= */

app.get(

  "/get-project-memory",

  (req,res) => {

    loadWorkspaceFiles();

    res.json(
      activeProject
    );

  }

);

/* =========================
   SAVE FILE
========================= */

app.post(

  "/save-file",

  (req,res) => {

    try {

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
        !fs.existsSync(
          dir
        )
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

    } catch(err){

      res.status(500).json({

        success:false,
        error:err.message

      });

    }

  }

);

/* =========================
   CREATE FILE
========================= */

app.post(

  "/create-file",

  (req,res) => {

    try {

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
        !fs.existsSync(
          dir
        )
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

    } catch(err){

      res.status(500).json({

        success:false

      });

    }

  }

);

/* =========================
   CREATE FOLDER
========================= */

app.post(

  "/create-folder",

  (req,res) => {

    try {

      const {
        name
      } = req.body;

      const folderPath =
        path.join(
          WORKSPACE,
          name
        );

      if(
        !fs.existsSync(
          folderPath
        )
      ){

        fs.mkdirSync(
          folderPath,
          {
            recursive:true
          }
        );

      }

      loadWorkspaceFiles();

      res.json({

        success:true

      });

    } catch(err){

      res.status(500).json({

        success:false

      });

    }

  }

);

/* =========================
   DELETE FILE
========================= */

app.post(

  "/delete-file",

  (req,res) => {

    try {

      const {
        name
      } = req.body;

      const filePath =
        path.join(
          WORKSPACE,
          name
        );

      if(
        fs.existsSync(
          filePath
        )
      ){

        const stat =
          fs.statSync(
            filePath
          );

        if(
          stat.isDirectory()
        ){

          fs.rmSync(
            filePath,
            {
              recursive:true,
              force:true
            }
          );

        } else {

          fs.unlinkSync(
            filePath
          );

        }

      }

      loadWorkspaceFiles();

      res.json({

        success:true

      });

    } catch(err){

      res.status(500).json({

        success:false

      });

    }

  }

);

/* =========================
   RENAME FILE
========================= */

app.post(

  "/rename-file",

  (req,res) => {

    try {

      const {
        oldName,
        newName
      } = req.body;

      const oldPath =
        path.join(
          WORKSPACE,
          oldName
        );

      const newPath =
        path.join(
          WORKSPACE,
          newName
        );

      fs.renameSync(
        oldPath,
        newPath
      );

      loadWorkspaceFiles();

      res.json({

        success:true

      });

    } catch(err){

      res.status(500).json({

        success:false

      });

    }

  }

);

/* =========================
   TERMINAL
========================= */

let terminalLogs = "";

app.post(

  "/terminal",

  (req,res) => {

    const {
      command
    } = req.body;

    exec(

      command,

      {
        cwd:WORKSPACE
      },

      (
        error,
        stdout,
        stderr
      ) => {

        const output =
          stdout || stderr;

        terminalLogs += `
${output}
`;

        res.json({

          output

        });

      }

    );

  }

);

/* =========================
   TERMINAL STREAM
========================= */

app.get(

  "/terminal-stream",

  (req,res) => {

    res.json({

      output:
        terminalLogs

    });

    terminalLogs = "";

  }

);

/* =========================
   OPENAI ANALYZE
========================= */

app.post(

  "/analyze",

  async (req,res) => {

    try {

      const {
        code,
        language
      } = req.body;

      const completion =
        await openai.chat.completions.create({

          model:
            "gpt-4.1-mini",

          messages:[

            {

              role:"system",

              content:`

You are an elite senior software engineer.

Analyze code professionally.

Return ONLY valid JSON.

Required JSON format:

{
  "issues": [],
  "fixes": [],
  "explanation": [],
  "fixedCode": ""
}

              `

            },

            {

              role:"user",

              content:`

Language:
${language}

Code:
${code}

              `

            }

          ],

          temperature:0.3

        });

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

      res.json(parsed);

    } catch(err){

      console.log(err);

      res.status(500).json({

        issues:[
          "AI analysis failed"
        ],

        fixes:[
          "Check OpenAI API"
        ],

        explanation:[
          err.message
        ],

        fixedCode:""

      });

    }

  }

);

/* =========================
   AUTONOMOUS AGENT
========================= */

app.post(

  "/autonomous-agent",

  async (req,res) => {

    try {

      const {
        prompt
      } = req.body;

      agentLogs = `
🤖 Agent Started...
`;

      const completion =
        await openai.chat.completions.create({

          model:
            "gpt-4.1-mini",

          messages:[

            {

              role:"system",

              content:`

You are an autonomous AI software engineer.

Generate a professional project structure.

Return ONLY valid JSON.

Format:

{
  "projectName":"",
  "files":[
    {
      "name":"",
      "content":""
    }
  ]
}

              `

            },

            {

              role:"user",

              content:prompt

            }

          ],

          temperature:0.4

        });

      agentLogs += `
🧠 AI planning completed...
`;

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

      /* =========================
         SAVE FILES
      ========================= */

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
          !fs.existsSync(
            dir
          )
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

        agentLogs += `
✔ Created:
${file.name}
`;

      }

      activeProject.projectName =
        parsed.projectName;

      loadWorkspaceFiles();

      agentLogs += `
🚀 Project Ready
`;

      res.json({

        success:true,

        summary:
`
Project:
${parsed.projectName}

Files Generated:
${parsed.files.length}
`

      });

    } catch(err){

      console.log(err);

      agentLogs += `
❌ Agent Failed
`;

      res.status(500).json({

        success:false,
        error:err.message

      });

    }

  }

);

/* =========================
   AGENT STATUS
========================= */

app.get(

  "/agent-status",

  (req,res) => {

    res.json({

      logs:agentLogs

    });

  }

);

/* =========================
   ROOT
========================= */

app.get(

  "/",

  (req,res) => {

    res.sendFile(

      path.join(

        __dirname,
        "public",
        "index.html"

      )

    );

  }

);

/* =========================
   START SERVER
========================= */

app.listen(

  PORT,

  () => {

    console.log(`

🚀 AI Dev Mentor Running
http://localhost:${PORT}

    `);

  }

);

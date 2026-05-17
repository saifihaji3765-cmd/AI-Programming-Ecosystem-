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
   LOAD FILES
========================= */

function loadWorkspaceFiles(){

  const files =
    fs.readdirSync(
      WORKSPACE
    );

  activeProject.files =
    files.map(file => {

      const filePath =
        path.join(
          WORKSPACE,
          file
        );

      const stat =
        fs.statSync(
          filePath
        );

      /* =========================
         FOLDER
      ========================= */

      if(stat.isDirectory()){

        return {

          name:file,
          type:"folder",
          content:""

        };

      }

      /* =========================
         FILE
      ========================= */

      return {

        name:file,
        type:"file",

        content:
          fs.readFileSync(
            filePath,
            "utf-8"
          )

      };

    });

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
          folderPath
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
          "Check API key"
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

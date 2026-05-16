const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { OpenAI } = require("openai");

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json({
  limit:"50mb"
}));

app.use(express.static("public"));

/* =========================
   OPENAI
========================= */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* =========================
   ACTIVE PROJECT MEMORY
========================= */

let activeProject = {
  projectName:"",
  files:[]
};

/* =========================
   SAFE JSON PARSER
========================= */

function safeJSONParse(text){

  try {

    return JSON.parse(text);

  } catch(err){

    const match =
      text.match(/\{[\s\S]*\}/);

    if(match){

      return JSON.parse(match[0]);

    }

    throw new Error(
      "Invalid AI JSON response"
    );

  }

}

/* =========================
   SAVE PROJECT FILES
========================= */

function saveProjectFiles(
  projectName,
  files
){

  const projectDir =
    path.join(
      __dirname,
      "generated_project"
    );

  if(
    fs.existsSync(projectDir)
  ){

    fs.rmSync(
      projectDir,
      {
        recursive:true,
        force:true
      }
    );

  }

  fs.mkdirSync(
    projectDir,
    {
      recursive:true
    }
  );

  files.forEach(file => {

    const filePath =
      path.join(
        projectDir,
        file.name
      );

    const dir =
      path.dirname(filePath);

    fs.mkdirSync(
      dir,
      {
        recursive:true
      }
    );

    fs.writeFileSync(
      filePath,
      file.content || ""
    );

  });

}

/* =========================
   CREATE ZIP
========================= */

function createZip(){

  return new Promise(
    (resolve,reject) => {

      const output =
        fs.createWriteStream(
          path.join(
            __dirname,
            "project.zip"
          )
        );

      const archive =
        archiver("zip", {
          zlib:{
            level:9
          }
        });

      output.on(
        "close",
        () => resolve()
      );

      archive.on(
        "error",
        err => reject(err)
      );

      archive.pipe(output);

      archive.directory(
        path.join(
          __dirname,
          "generated_project"
        ),
        false
      );

      archive.finalize();

    }
  );

}

/* =========================
   ANALYZE CODE
========================= */

app.post(
  "/analyze",
  async (req,res) => {

    try {

      const {
        code,
        language
      } = req.body;

      const prompt = `

You are an elite senior software engineer.

Analyze the following code.

Return ONLY valid JSON:

{
  "issues": [],
  "fixes": [],
  "explanation": [],
  "fixedCode": ""
}

Language:
${language}

Code:
${code}

`;

      const response =
        await openai.chat.completions.create({

          model:"gpt-4.1-mini",

          messages:[
            {
              role:"user",
              content:prompt
            }
          ],

          temperature:0.2

        });

      const content =
        response
        .choices[0]
        .message
        .content;

      const result =
        safeJSONParse(content);

      res.json(result);

    } catch(err){

      console.log(err);

      res.status(500).json({

        issues:[
          "Server error"
        ],

        fixes:[
          "Check API key or logs"
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
   GENERATE PROJECT
========================= */

app.post(
  "/generate-project",
  async (req,res) => {

    try {

      const {
        prompt
      } = req.body;

      const aiPrompt = `

You are an elite full stack AI engineer.

Generate a COMPLETE production-ready project.

Return ONLY valid JSON.

FORMAT:

{
  "projectName":"",
  "files":[
    {
      "name":"",
      "content":""
    }
  ]
}

IMPORTANT:

- Generate REAL code
- Generate MULTIPLE files
- Include package.json
- Include frontend
- Include backend
- Include styling
- Use clean architecture
- No markdown
- No explanations
- JSON ONLY

PROJECT REQUEST:
${prompt}

`;

      const response =
        await openai.chat.completions.create({

          model:"gpt-4.1-mini",

          messages:[
            {
              role:"user",
              content:aiPrompt
            }
          ],

          temperature:0.4

        });

      const content =
        response
        .choices[0]
        .message
        .content;

      const result =
        safeJSONParse(content);

      /* =========================
         SAVE ACTIVE PROJECT
      ========================= */

      activeProject = result;

      /* =========================
         SAVE FILES
      ========================= */

      saveProjectFiles(
        result.projectName,
        result.files
      );

      /* =========================
         CREATE ZIP
      ========================= */

      await createZip();

      res.json(result);

    } catch(err){

      console.log(err);

      res.status(500).json({

        success:false,
        error:err.message

      });

    }

  }
);

/* =========================
   SAVE ACTIVE PROJECT
========================= */

app.post(
  "/save-project-memory",
  (req,res) => {

    try {

      activeProject =
        req.body;

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
   GET ACTIVE PROJECT
========================= */

app.get(
  "/get-project-memory",
  (req,res) => {

    res.json(activeProject);

  }
);
/* =========================
   SAVE SINGLE FILE
========================= */

app.post(
  "/save-file",
  (req,res) => {

    try {

      const {
        fileName,
        content
      } = req.body;

      /* =========================
         UPDATE MEMORY
      ========================= */

      const file =
        activeProject.files.find(
          f => f.name === fileName
        );

      if(file){

        file.content = content;

      }

      /* =========================
         UPDATE DISK FILE
      ========================= */

      const filePath =
        path.join(
          __dirname,
          "generated_project",
          fileName
        );

      fs.writeFileSync(
        filePath,
        content
      );

      res.json({
        success:true
      });

    } catch(err){

      console.log(err);

      res.status(500).json({
        success:false
      });

    }

  }
);
/* =========================
   DOWNLOAD ZIP
========================= */

app.get(
  "/download-project",
  (req,res) => {

    const zipPath =
      path.join(
        __dirname,
        "project.zip"
      );

    if(
      !fs.existsSync(zipPath)
    ){

      return res.status(404).send(
        "ZIP not found"
      );

    }

    res.download(zipPath);

  }
);

/* =========================
   ROOT
========================= */

app.get("/", (req,res) => {

  res.sendFile(
    path.join(
      __dirname,
      "public",
      "index.html"
    )
  );

});

/* =========================
   START SERVER
========================= */

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    "🚀 AI Dev Mentor Pro Running"
  );

});

const express = require("express");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* =========================
   ACTIVE PROJECT MEMORY
========================= */

let activeProject = {
  projectName: "",
  files: []
};

/* =========================
   SAFE JSON PARSER
========================= */

function safeJSONParse(text) {

  try {

    return JSON.parse(text);

  } catch (e) {

    const match =
      text.match(/\{[\s\S]*\}/);

    if (match) {

      return JSON.parse(match[0]);

    }

    throw new Error(
      "Invalid AI response format"
    );

  }

}

/* =========================
   AI CODE ANALYZER
========================= */

app.post("/analyze", async (req, res) => {

  try {

    const { code, language } = req.body;

    const prompt = `
You are a senior software engineer AI.

Return ONLY valid JSON:

{
  "issues": [],
  "fixes": [],
  "explanation": [],
  "fixedCode": ""
}

Analyze this ${language} code:

${code}
`;

    const response =
      await openai.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [
          {
            role: "user",
            content: prompt
          }
        ]

      });

    const content =
      response.choices[0].message.content;

    const result =
      safeJSONParse(content);

    res.json(result);

  } catch (err) {

    console.error(err);

    res.status(500).json({

      issues: ["Server error"],

      fixes: ["Check API key or logs"],

      explanation: [err.message],

      fixedCode: ""

    });

  }

});

/* =========================
   ENGINEERING REVIEW MODE
========================= */

app.post("/engineering-review", async (req, res) => {

  try {

    const { code, language } = req.body;

    const prompt = `
You are a world-class software architect and senior engineering reviewer.

Analyze this ${language} code deeply.

Return ONLY valid JSON:

{
  "securityIssues": [],
  "performanceIssues": [],
  "scalabilityIssues": [],
  "architectureReview": [],
  "bestPractices": [],
  "productionRecommendations": []
}

IMPORTANT:
- Think like a senior engineer
- Give professional analysis
- Mention real-world improvements
- Explain clearly

CODE:
${code}
`;

    const response =
      await openai.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [
          {
            role: "user",
            content: prompt
          }
        ]

      });

    const content =
      response.choices[0].message.content;

    const result =
      safeJSONParse(content);

    res.json(result);

  } catch (err) {

    console.error(err);

    res.status(500).json({

      securityIssues: ["Server error"],

      performanceIssues: [],

      scalabilityIssues: [],

      architectureReview: [err.message],

      bestPractices: [],

      productionRecommendations: []

    });

  }

});

/* =========================
   AI PROJECT GENERATOR
========================= */

app.post("/generate-project", async (req, res) => {

  try {

    const { idea } = req.body;

    const prompt = `
You are a world-class senior software architect AI.

Generate a COMPLETE production-ready software project.

Return ONLY valid JSON:

{
  "projectName": "",
  "files": [
    {
      "name": "",
      "content": ""
    }
  ],
  "setupGuide": "",
  "deployGuide": ""
}

IMPORTANT:
- Generate REAL code
- Include frontend + backend
- Include package.json
- Make production-ready

Project Idea:
${idea}
`;

    const response =
      await openai.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [
          {
            role: "user",
            content: prompt
          }
        ]

      });

    const content =
      response.choices[0].message.content;

    const result =
      safeJSONParse(content);

    /* =========================
       SAVE ACTIVE PROJECT
    ========================= */

    activeProject = result;

    /* =========================
       TEMP PROJECT FOLDER
    ========================= */

    const projectDir =
      path.join(__dirname, "temp_project");

    if (!fs.existsSync(projectDir)) {

      fs.mkdirSync(projectDir);

    }

    /* =========================
       WRITE FILES
    ========================= */

    result.files.forEach(file => {

      const filePath =
        path.join(projectDir, file.name);

      fs.writeFileSync(
        filePath,
        file.content
      );

    });

    /* =========================
       CREATE ZIP
    ========================= */

    const zipPath =
      path.join(__dirname, "project.zip");

    const output =
      fs.createWriteStream(zipPath);

    const archive =
      archiver("zip", {
        zlib: { level: 9 }
      });

    archive.pipe(output);

    archive.directory(projectDir, false);

    archive.finalize();

    output.on("close", () => {

      res.json({
        ...result,
        download: "/download-project"
      });

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      projectName: "Error",

      files: [],

      setupGuide: err.message,

      deployGuide: ""

    });

  }

});

/* =========================
   FILE EDITING ENGINE
========================= */

app.post("/edit-project", async (req, res) => {

  try {

    const { instruction } = req.body;

    if (
      !activeProject ||
      !activeProject.files ||
      activeProject.files.length === 0
    ) {

      return res.status(400).json({
        error: "No active project loaded"
      });

    }

    const projectContext =
      JSON.stringify(activeProject);

    const prompt = `
You are a senior AI software engineer.

You are editing an EXISTING software project.

PROJECT:
${projectContext}

USER REQUEST:
${instruction}

Return ONLY valid JSON:

{
  "projectName": "",
  "files": [
    {
      "name": "",
      "content": ""
    }
  ],
  "summary": ""
}

IMPORTANT:
- MODIFY existing files intelligently
- Keep architecture clean
- Only change necessary files
- Return full updated file contents
- Maintain production quality
`;

    const response =
      await openai.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [
          {
            role: "user",
            content: prompt
          }
        ]

      });

    const content =
      response.choices[0].message.content;

    const result =
      safeJSONParse(content);

    /* =========================
       UPDATE ACTIVE PROJECT
    ========================= */

    activeProject = result;

    res.json(result);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});

/* =========================
   SAVE PROJECT MEMORY
========================= */

app.post("/save-project-memory", (req, res) => {

  try {

    activeProject = req.body;

    res.json({
      success: true,
      message: "Project memory saved"
    });

  } catch (err) {

    res.status(500).json({
      success: false
    });

  }

});

/* =========================
   GET PROJECT MEMORY
========================= */

app.get("/get-project-memory", (req, res) => {

  res.json(activeProject);

});

/* =========================
   DOWNLOAD ZIP
========================= */

app.get("/download-project", (req, res) => {

  const zipPath =
    path.join(__dirname, "project.zip");

  if (fs.existsSync(zipPath)) {

    res.download(zipPath);

  } else {

    res.status(404).send(
      "ZIP file not found"
    );

  }

});

/* =========================
   START SERVER
========================= */

app.listen(3000, () => {

  console.log(
    "🚀 AI Dev Mentor Pro Running"
  );

});

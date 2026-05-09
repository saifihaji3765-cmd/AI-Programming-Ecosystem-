const express = require("express");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function safeJSONParse(text) {

  try {
    return JSON.parse(text);
  } catch (e) {

    const match = text.match(/\{[\s\S]*\}/);

    if (match) {
      return JSON.parse(match[0]);
    }

    throw new Error("Invalid AI response format");
  }
}

/* =========================
   AI ANALYZE
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const content = response.choices[0].message.content;

    const result = safeJSONParse(content);

    res.json(result);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      issues: ["Server error"],
      fixes: ["Check API or logs"],
      explanation: [err.message],
      fixedCode: ""
    });

  }

});

/* =========================
   PROJECT GENERATOR
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
- Include multiple files
- Include package.json
- Include frontend + backend

Project Idea:
${idea}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const content = response.choices[0].message.content;

    const result = safeJSONParse(content);

    /* =========================
       CREATE TEMP PROJECT
    ========================= */

    const projectDir = path.join(__dirname, "temp_project");

    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir);
    }

    result.files.forEach(file => {

      const filePath = path.join(projectDir, file.name);

      fs.writeFileSync(filePath, file.content);

    });

    /* =========================
       CREATE ZIP
    ========================= */

    const zipPath = path.join(__dirname, "project.zip");

    const output = fs.createWriteStream(zipPath);

    const archive = archiver("zip", {
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

    res.json({
      ...result,
      download: "/download-project"
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
   DOWNLOAD ZIP
========================= */

app.get("/download-project", (req, res) => {

  const zipPath = path.join(__dirname, "project.zip");

  if (fs.existsSync(zipPath)) {

    res.download(zipPath);

  } else {

    res.status(404).send("ZIP file not found");

  }

});

/* =========================
   START SERVER
========================= */

app.listen(3000, () => {
  console.log("AI Dev Mentor Pro Running 🚀");
});

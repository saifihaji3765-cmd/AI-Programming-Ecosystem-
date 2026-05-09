const express = require("express");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

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
   AI CODE ANALYZER ROUTE
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
          content: prompt,
        },
      ],
    });

    const content = response.choices[0].message.content;

    const result = safeJSONParse(content);

    res.json(result);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      issues: ["Server error"],
      fixes: ["Check API key or logs"],
      explanation: [err.message],
      fixedCode: "",
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

Generate a COMPLETE software project.

Return ONLY valid JSON in this exact format:

{
  "projectName": "",
  "folderStructure": "",
  "frontendCode": "",
  "backendCode": "",
  "setupGuide": "",
  "deployGuide": ""
}

IMPORTANT:
- Generate REAL code
- Make it production-ready
- Include frontend + backend
- Include setup instructions
- Include deployment steps

Project Idea:
${idea}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0].message.content;

    const result = safeJSONParse(content);

    res.json(result);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      projectName: "Error",
      folderStructure: "",
      frontendCode: "",
      backendCode: "",
      setupGuide: err.message,
      deployGuide: "",
    });
  }
});

/* =========================
   SERVER START
========================= */

app.listen(3000, () => {
  console.log("AI Dev Mentor Pro Running 🚀");
});

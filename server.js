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
    if (match) return JSON.parse(match[0]);
    throw new Error("Invalid AI response");
  }
}

app.post("/analyze", async (req, res) => {
  try {
    const { code, language } = req.body;

    const prompt = `
You are an expert senior developer AI.

Return ONLY valid JSON:

{
  "issues": [],
  "fixes": [],
  "explanation": [],
  "fixedCode": ""
}

Code:
${code}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0].message.content;
    const result = safeJSONParse(content);

    res.json(result);

  } catch (err) {
    res.status(500).json({
      issues: ["Server error"],
      fixes: ["Check API or logs"],
      explanation: [err.message],
      fixedCode: ""
    });
  }
});

app.listen(3000, () => {
  console.log("AI Dev Mentor Pro Running 🚀");
});

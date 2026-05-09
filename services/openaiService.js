const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeCodeWithAI(code, language) {
  const prompt = `
You are a senior software engineer.
Analyze this ${language} code.

Tasks:
1. Find bugs
2. Explain issues
3. Fix code
4. Improve best practices

Code:
${code}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

module.exports = { analyzeCodeWithAI };

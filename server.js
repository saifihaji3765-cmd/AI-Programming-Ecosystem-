const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/analyze", (req, res) => {
    const { code, language } = req.body;

    if (!code) {
        return res.json({ error: "No code provided" });
    }

    let response = analyzeCode(code, language);

    res.json(response);
});

function analyzeCode(code, language) {
    let issues = [];
    let fixes = [];
    let explanation = [];

    // BASIC RULE ENGINE (MVP CORE - NO REWRITE NEEDED LATER)

    if (code.includes("==") && language === "python") {
        issues.push("Possible comparison issue in Python");
        fixes.push("Use '=' for assignment or '==' correctly depending context");
        explanation.push("Python uses indentation and strict syntax rules");
    }

    if (code.includes("print") === false) {
        explanation.push("No output function found, code may not show result");
    }

    if (code.includes("{") && language === "python") {
        issues.push("Braces found in Python code");
        fixes.push("Python uses indentation instead of {}");
    }

    return {
        issues,
        fixes,
        explanation,
        status: issues.length === 0 ? "Clean code" : "Issues found"
    };
}

app.listen(3000, () => {
    console.log("AI Code Mentor running on port 3000");
});

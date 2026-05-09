const express = require("express");
const router = express.Router();
const { analyzeCodeWithAI } = require("../services/openaiService");

router.post("/", async (req, res) => {
  try {
    const { code, language } = req.body;

    const result = await analyzeCodeWithAI(code, language);

    res.json({ success: true, result });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

module.exports = router;

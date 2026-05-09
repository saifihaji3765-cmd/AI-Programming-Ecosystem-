const express = require("express");
const router = express.Router();
const { fetchRepoCode } = require("../services/githubService");

router.post("/import", async (req, res) => {
  const { repoUrl } = req.body;

  const data = await fetchRepoCode(repoUrl);

  res.json({ success: true, files: data });
});

module.exports = router;

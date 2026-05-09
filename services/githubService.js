const axios = require("axios");

async function fetchRepoCode(repoUrl) {
  const parts = repoUrl.replace("https://github.com/", "").split("/");
  const owner = parts[0];
  const repo = parts[1];

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;

  const res = await axios.get(apiUrl, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });

  return res.data;
}

module.exports = { fetchRepoCode };

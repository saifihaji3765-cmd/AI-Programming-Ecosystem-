// =========================
// MASTER AGENT
// =========================

async function masterAgent(
  userPrompt
){

  // =========================
  // CLEAN PROMPT
  // =========================

  const cleanPrompt =
  userPrompt
  .trim();

  // =========================
  // DETECT PROJECT TYPE
  // =========================

  let projectType =
  "web-app";

  // =========================
  // FRONTEND
  // =========================

  const frontendKeywords = [

    "landing page",

    "ui",

    "frontend",

    "design",

    "website"

  ];

  // =========================
  // BACKEND
  // =========================

  const backendKeywords = [

    "api",

    "backend",

    "server",

    "database",

    "auth"

  ];

  // =========================
  // AI
  // =========================

  const aiKeywords = [

    "ai",

    "agent",

    "openai",

    "chatbot",

    "automation"

  ];

  // =========================
  // FLAGS
  // =========================

  const needsFrontend =
  frontendKeywords.some(
    keyword =>
    cleanPrompt
    .toLowerCase()
    .includes(keyword)
  );

  const needsBackend =
  backendKeywords.some(
    keyword =>
    cleanPrompt
    .toLowerCase()
    .includes(keyword)
  );

  const needsAI =
  aiKeywords.some(
    keyword =>
    cleanPrompt
    .toLowerCase()
    .includes(keyword)
  );

  // =========================
  // BUILD PLAN
  // =========================

  const buildPlan = {

    originalPrompt:
    userPrompt,

    cleanPrompt,

    projectType,

    agents:{

      frontend:
      needsFrontend,

      backend:
      needsBackend,

      ai:
      needsAI

    }

  };

  // =========================
  // RETURN
  // =========================

  return buildPlan;

}

// =========================
// EXPORT
// =========================

module.exports =
masterAgent;

// =========================
// FRONTEND AGENT
// =========================

async function frontendAgent(

  buildPlan

){

  // =========================
  // PROMPT
  // =========================

  const prompt =
  buildPlan.cleanPrompt;

  // =========================
  // UI STYLE
  // =========================

  let uiStyle =
  "modern";

  // =========================
  // DETECT STYLE
  // =========================

  if(
    prompt.includes("dashboard")
  ){

    uiStyle =
    "dashboard";

  }

  if(
    prompt.includes("landing")
  ){

    uiStyle =
    "landing-page";

  }

  if(
    prompt.includes("ai")
  ){

    uiStyle =
    "ai-interface";

  }

  // =========================
  // COMPONENTS
  // =========================

  const components = [];

  // =========================
  // HERO
  // =========================

  if(

    prompt.includes("website") ||

    prompt.includes("landing")

  ){

    components.push(
      "hero-section"
    );

  }

  // =========================
  // DASHBOARD
  // =========================

  if(
    prompt.includes("dashboard")
  ){

    components.push(
      "sidebar"
    );

    components.push(
      "topbar"
    );

    components.push(
      "analytics-cards"
    );

  }

  // =========================
  // AI CHAT
  // =========================

  if(
    prompt.includes("ai")
  ){

    components.push(
      "chat-interface"
    );

    components.push(
      "prompt-box"
    );

  }

  // =========================
  // RESULT
  // =========================

  const frontendPlan = {

    framework:"html-css-js",

    uiStyle,

    responsive:true,

    darkMode:true,

    animations:true,

    components

  };

  // =========================
  // RETURN
  // =========================

  return frontendPlan;

}

// =========================
// EXPORT
// =========================

module.exports =
frontendAgent;

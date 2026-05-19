// =========================
// DEVOPS AGENT
// =========================

async function devopsAgent(

  buildPlan

){

  // =========================
  // PROMPT
  // =========================

  const prompt =
  buildPlan.cleanPrompt
  .toLowerCase();

  // =========================
  // HOSTING
  // =========================

  let hosting =
  "render";

  // =========================
  // DOCKER
  // =========================

  let docker =
  true;

  // =========================
  // CI CD
  // =========================

  let cicd =
  true;

  // =========================
  // ENV
  // =========================

  let environment =
  true;

  // =========================
  // SSL
  // =========================

  let ssl =
  true;

  // =========================
  // DOMAIN
  // =========================

  let customDomain =
  true;

  // =========================
  // MONITORING
  // =========================

  let monitoring =
  true;

  // =========================
  // BACKUPS
  // =========================

  let backups =
  true;

  // =========================
  // SCALING
  // =========================

  let autoscaling =
  false;

  // =========================
  // DETECT VERCEL
  // =========================

  if(

    prompt.includes("nextjs") ||

    prompt.includes("vercel")

  ){

    hosting =
    "vercel";

  }

  // =========================
  // DETECT NETLIFY
  // =========================

  if(

    prompt.includes("static") ||

    prompt.includes("landing page")

  ){

    hosting =
    "netlify";

  }

  // =========================
  // DETECT SCALE
  // =========================

  if(

    prompt.includes("saas") ||

    prompt.includes("high traffic") ||

    prompt.includes("enterprise")

  ){

    autoscaling =
    true;

  }

  // =========================
  // DEPLOYMENT FILES
  // =========================

  const deploymentFiles = [

    "Dockerfile",

    ".dockerignore",

    ".env",

    ".gitignore",

    "render.yaml"

  ];

  // =========================
  // CI CD PIPELINE
  // =========================

  const pipeline = {

    githubActions:true,

    autoDeploy:true,

    testing:true,

    productionBuild:true

  };

  // =========================
  // RESULT
  // =========================

  const devopsPlan = {

    hosting,

    docker,

    cicd,

    environment,

    ssl,

    customDomain,

    monitoring,

    backups,

    autoscaling,

    deploymentFiles,

    pipeline,

    productionReady:true

  };

  // =========================
  // RETURN
  // =========================

  return devopsPlan;

}

// =========================
// EXPORT
// =========================

module.exports =
devopsAgent;

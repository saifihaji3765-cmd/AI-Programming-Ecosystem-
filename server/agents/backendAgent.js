// =========================
// BACKEND AGENT
// =========================

async function backendAgent(

  buildPlan

){

  // =========================
  // PROMPT
  // =========================

  const prompt =
  buildPlan.cleanPrompt
  .toLowerCase();

  // =========================
  // BACKEND STACK
  // =========================

  let backendFramework =
  "express";

  // =========================
  // DATABASE
  // =========================

  let database =
  null;

  // =========================
  // AUTH
  // =========================

  let authentication =
  false;

  // =========================
  // API SYSTEM
  // =========================

  let apiSystem =
  false;

  // =========================
  // REALTIME
  // =========================

  let realtime =
  false;

  // =========================
  // PAYMENT
  // =========================

  let payment =
  false;

  // =========================
  // DETECT DATABASE
  // =========================

  if(

    prompt.includes("mongodb") ||

    prompt.includes("mongo")

  ){

    database =
    "mongodb";

  }

  if(

    prompt.includes("postgresql") ||

    prompt.includes("postgres")

  ){

    database =
    "postgresql";

  }

  // =========================
  // DETECT AUTH
  // =========================

  if(

    prompt.includes("login") ||

    prompt.includes("signup") ||

    prompt.includes("auth") ||

    prompt.includes("user")

  ){

    authentication =
    true;

  }

  // =========================
  // DETECT API
  // =========================

  if(

    prompt.includes("api") ||

    prompt.includes("backend") ||

    prompt.includes("server")

  ){

    apiSystem =
    true;

  }

  // =========================
  // DETECT REALTIME
  // =========================

  if(

    prompt.includes("chat") ||

    prompt.includes("live") ||

    prompt.includes("realtime")

  ){

    realtime =
    true;

  }

  // =========================
  // DETECT PAYMENT
  // =========================

  if(

    prompt.includes("payment") ||

    prompt.includes("subscription") ||

    prompt.includes("stripe")

  ){

    payment =
    true;

  }

  // =========================
  // BUILD RESULT
  // =========================

  const backendPlan = {

    framework:
    backendFramework,

    database,

    authentication,

    apiSystem,

    realtime,

    payment,

    scalable:true,

    productionReady:true

  };

  // =========================
  // RETURN
  // =========================

  return backendPlan;

}

// =========================
// EXPORT
// =========================

module.exports =
backendAgent;

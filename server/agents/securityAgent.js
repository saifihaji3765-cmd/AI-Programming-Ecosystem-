// =========================
// SECURITY AGENT
// =========================

async function securityAgent(

  buildPlan

){

  // =========================
  // PROMPT
  // =========================

  const prompt =
  buildPlan.cleanPrompt
  .toLowerCase();

  // =========================
  // AUTH
  // =========================

  let authentication =
  false;

  // =========================
  // JWT
  // =========================

  let jwtSecurity =
  false;

  // =========================
  // ENV SECURITY
  // =========================

  let envProtection =
  true;

  // =========================
  // API PROTECTION
  // =========================

  let apiProtection =
  true;

  // =========================
  // INPUT VALIDATION
  // =========================

  let inputValidation =
  true;

  // =========================
  // RATE LIMIT
  // =========================

  let rateLimit =
  true;

  // =========================
  // CORS
  // =========================

  let corsProtection =
  true;

  // =========================
  // ENCRYPTION
  // =========================

  let encryption =
  false;

  // =========================
  // DATABASE SECURITY
  // =========================

  let databaseSecurity =
  false;

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

    jwtSecurity =
    true;

  }

  // =========================
  // DETECT DATABASE
  // =========================

  if(

    prompt.includes("database") ||

    prompt.includes("mongodb") ||

    prompt.includes("postgres")

  ){

    databaseSecurity =
    true;

  }

  // =========================
  // DETECT PAYMENT
  // =========================

  if(

    prompt.includes("payment") ||

    prompt.includes("bank") ||

    prompt.includes("stripe")

  ){

    encryption =
    true;

  }

  // =========================
  // SECURITY RULES
  // =========================

  const securityRules = [

    "Never expose API keys",

    "Always use environment variables",

    "Validate all user inputs",

    "Protect API routes",

    "Sanitize request body",

    "Enable CORS security",

    "Prevent brute force attacks",

    "Use secure authentication"

  ];

  // =========================
  // RESULT
  // =========================

  const securityPlan = {

    authentication,

    jwtSecurity,

    envProtection,

    apiProtection,

    inputValidation,

    rateLimit,

    corsProtection,

    encryption,

    databaseSecurity,

    securityRules,

    productionReady:true

  };

  // =========================
  // RETURN
  // =========================

  return securityPlan;

}

// =========================
// EXPORT
// =========================

module.exports =
securityAgent;

// =========================
// INTENT AGENT
// =========================

export async function detectIntent(userMessage){

  // =========================
  // LOWERCASE
  // =========================

  const text =
  userMessage.toLowerCase();

  // =========================
  // DEFAULT RESPONSE
  // =========================

  const result = {

    intent: "general",

    category: null,

    needsFrontend: false,

    needsBackend: false,

    needsDatabase: false,

    needsAuth: false,

    needsPayment: false,

    needsAdminPanel: false,

    confidence: 0

  };

  // =========================
  // BUILD APP
  // =========================

  if(

    text.includes("build") ||

    text.includes("create") ||

    text.includes("app") ||

    text.includes("website") ||

    text.includes("dashboard")

  ){

    result.intent =
    "build_app";

    result.confidence = 90;

  }

  // =========================
  // BUG FIX
  // =========================

  if(

    text.includes("bug") ||

    text.includes("fix") ||

    text.includes("error") ||

    text.includes("not working")

  ){

    result.intent =
    "bug_fix";

    result.confidence = 95;

  }

  // =========================
  // FOOD DELIVERY
  // =========================

  if(

    text.includes("food") ||

    text.includes("restaurant") ||

    text.includes("delivery")

  ){

    result.category =
    "food_delivery";

    result.needsFrontend = true;

    result.needsBackend = true;

    result.needsDatabase = true;

    result.needsAuth = true;

    result.needsAdminPanel = true;

  }

  // =========================
  // ECOMMERCE
  // =========================

  if(

    text.includes("ecommerce") ||

    text.includes("store") ||

    text.includes("shop")

  ){

    result.category =
    "ecommerce";

    result.needsFrontend = true;

    result.needsBackend = true;

    result.needsDatabase = true;

    result.needsPayment = true;

    result.needsAuth = true;

    result.needsAdminPanel = true;

  }

  // =========================
  // SAAS
  // =========================

  if(

    text.includes("saas") ||

    text.includes("ai tool") ||

    text.includes("startup")

  ){

    result.category =
    "saas";

    result.needsFrontend = true;

    result.needsBackend = true;

    result.needsDatabase = true;

    result.needsAuth = true;

  }

  // =========================
  // TRADING
  // =========================

  if(

    text.includes("trading") ||

    text.includes("crypto") ||

    text.includes("stock")

  ){

    result.category =
    "trading_platform";

    result.needsFrontend = true;

    result.needsBackend = true;

    result.needsDatabase = true;

    result.needsAuth = true;

  }

  // =========================
  // RETURN
  // =========================

  return result;

}

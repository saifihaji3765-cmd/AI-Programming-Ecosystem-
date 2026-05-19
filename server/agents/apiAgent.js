// =========================
// API AGENT
// =========================

async function apiAgent(

  buildPlan

){

  // =========================
  // PROMPT
  // =========================

  const prompt =
  buildPlan.cleanPrompt
  .toLowerCase();

  // =========================
  // API SERVICES
  // =========================

  const services = [];

  // =========================
  // OPENAI
  // =========================

  if(

    prompt.includes("ai") ||

    prompt.includes("chatbot") ||

    prompt.includes("assistant")

  ){

    services.push({

      name:"openai",

      purpose:
      "AI generation"

    });

  }

  // =========================
  // STRIPE
  // =========================

  if(

    prompt.includes("payment") ||

    prompt.includes("subscription") ||

    prompt.includes("stripe")

  ){

    services.push({

      name:"stripe",

      purpose:
      "payments"

    });

  }

  // =========================
  // FIREBASE
  // =========================

  if(

    prompt.includes("firebase")

  ){

    services.push({

      name:"firebase",

      purpose:
      "authentication-database"

    });

  }

  // =========================
  // SUPABASE
  // =========================

  if(

    prompt.includes("supabase")

  ){

    services.push({

      name:"supabase",

      purpose:
      "backend-database"

    });

  }

  // =========================
  // CLOUDINARY
  // =========================

  if(

    prompt.includes("image") ||

    prompt.includes("upload") ||

    prompt.includes("media")

  ){

    services.push({

      name:"cloudinary",

      purpose:
      "media-storage"

    });

  }

  // =========================
  // EMAIL
  // =========================

  if(

    prompt.includes("email") ||

    prompt.includes("otp") ||

    prompt.includes("verification")

  ){

    services.push({

      name:"resend",

      purpose:
      "email-system"

    });

  }

  // =========================
  // REALTIME
  // =========================

  let realtime =
  false;

  if(

    prompt.includes("chat") ||

    prompt.includes("live") ||

    prompt.includes("realtime")

  ){

    realtime =
    true;

  }

  // =========================
  // WEBHOOKS
  // =========================

  let webhooks =
  false;

  if(

    prompt.includes("webhook")

  ){

    webhooks =
    true;

  }

  // =========================
  // FINAL RESULT
  // =========================

  const apiPlan = {

    services,

    realtime,

    webhooks,

    secure:true,

    scalable:true,

    productionReady:true

  };

  // =========================
  // RETURN
  // =========================

  return apiPlan;

}

// =========================
// EXPORT
// =========================

module.exports =
apiAgent;

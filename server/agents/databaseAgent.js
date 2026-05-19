// =========================
// DATABASE AGENT
// =========================

async function databaseAgent(

  buildPlan

){

  // =========================
  // PROMPT
  // =========================

  const prompt =
  buildPlan.cleanPrompt
  .toLowerCase();

  // =========================
  // DATABASE
  // =========================

  let database =
  "mongodb";

  // =========================
  // ORM
  // =========================

  let orm =
  "mongoose";

  // =========================
  // AUTH MODEL
  // =========================

  let userModel =
  false;

  // =========================
  // RELATIONS
  // =========================

  let relations =
  false;

  // =========================
  // REALTIME DATA
  // =========================

  let realtime =
  false;

  // =========================
  // CACHE
  // =========================

  let cache =
  false;

  // =========================
  // DETECT POSTGRES
  // =========================

  if(

    prompt.includes("postgres") ||

    prompt.includes("sql")

  ){

    database =
    "postgresql";

    orm =
    "prisma";

  }

  // =========================
  // DETECT AUTH
  // =========================

  if(

    prompt.includes("login") ||

    prompt.includes("signup") ||

    prompt.includes("user")

  ){

    userModel =
    true;

  }

  // =========================
  // DETECT RELATIONS
  // =========================

  if(

    prompt.includes("relation") ||

    prompt.includes("admin") ||

    prompt.includes("team")

  ){

    relations =
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
  // DETECT CACHE
  // =========================

  if(

    prompt.includes("high traffic") ||

    prompt.includes("scalable") ||

    prompt.includes("performance")

  ){

    cache =
    true;

  }

  // =========================
  // MODELS
  // =========================

  const models = [];

  // =========================
  // USER MODEL
  // =========================

  if(userModel){

    models.push({

      name:"User",

      fields:[

        "name",

        "email",

        "password",

        "role",

        "createdAt"

      ]

    });

  }

  // =========================
  // CHAT MODEL
  // =========================

  if(realtime){

    models.push({

      name:"Message",

      fields:[

        "sender",

        "content",

        "timestamp"

      ]

    });

  }

  // =========================
  // PROJECT MODEL
  // =========================

  models.push({

    name:"Project",

    fields:[

      "title",

      "description",

      "files",

      "createdAt"

    ]

  });

  // =========================
  // RESULT
  // =========================

  const databasePlan = {

    database,

    orm,

    userModel,

    relations,

    realtime,

    cache,

    models,

    scalable:true,

    productionReady:true

  };

  // =========================
  // RETURN
  // =========================

  return databasePlan;

}

// =========================
// EXPORT
// =========================

module.exports =
databaseAgent;

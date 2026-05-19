// =========================
// IMPORT AGENTS
// =========================

import {
  detectIntent
}
from "./intentAgent.js";

import {
  generateProjectPlan
}
from "./planningAgent.js";

import {
  generateFiles
}
from "./builderAgent.js";

// =========================
// MASTER AI SYSTEM
// =========================

export async function runAIAgent(userPrompt){

  try{

    // =========================
    // STEP 1
    // UNDERSTAND USER
    // =========================

    const intentData =
    await detectIntent(
      userPrompt
    );

    // =========================
    // STEP 2
    // CREATE PLAN
    // =========================

    const plan =
    await generateProjectPlan(
      intentData
    );

    // =========================
    // STEP 3
    // GENERATE FILES
    // =========================

    const files =
    await generateFiles(
      plan
    );

    // =========================
    // FINAL RESPONSE
    // =========================

    return {

      success:true,

      prompt:userPrompt,

      intent:intentData,

      architecture:plan,

      files

    };

  }

  // =========================
  // ERROR
  // =========================

  catch(error){

    console.log(error);

    return {

      success:false,

      error:error.message

    };

  }

}

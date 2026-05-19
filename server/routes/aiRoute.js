// =========================
// EXPRESS
// =========================

import express from "express";

// =========================
// MASTER AGENT
// =========================

import {
  runAIAgent
}
from "../agents/masterAgent.js";

// =========================
// ROUTER
// =========================

const router =
express.Router();

// =========================
// AI ROUTE
// =========================

router.post(
  "/ai",
  async (req,res)=>{

    try{

      // =========================
      // USER PROMPT
      // =========================

      const {
        prompt
      } = req.body;

      // =========================
      // EMPTY PROMPT
      // =========================

      if(!prompt){

        return res.status(400)
        .json({

          success:false,

          error:
          "Prompt required"

        });

      }

      // =========================
      // RUN AI SYSTEM
      // =========================

      const result =
      await runAIAgent(
        prompt
      );

      // =========================
      // RESPONSE
      // =========================

      res.json(result);

    }

    // =========================
    // ERROR
    // =========================

    catch(error){

      console.log(error);

      res.status(500)
      .json({

        success:false,

        error:error.message

      });

    }

  }
);

// =========================
// EXPORT
// =========================

export default router;

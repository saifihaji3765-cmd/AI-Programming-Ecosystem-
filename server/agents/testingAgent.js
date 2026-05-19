// =========================
// TESTING AGENT
// =========================

async function testingAgent(

  projectFiles

){

  // =========================
  // TEST RESULTS
  // =========================

  const results = [];

  // =========================
  // TOTAL
  // =========================

  let passed = 0;

  let failed = 0;

  // =========================
  // LOOP FILES
  // =========================

  for(

    const file
    of projectFiles

  ){

    const content =
    file.content || "";

    // =========================
    // FILE EXISTS
    // =========================

    if(

      content.trim() !== ""

    ){

      results.push({

        file:file.name,

        test:"File Exists",

        status:"passed"

      });

      passed++;

    }

    else {

      results.push({

        file:file.name,

        test:"File Empty",

        status:"failed"

      });

      failed++;

    }

    // =========================
    // HTML TEST
    // =========================

    if(

      file.name.endsWith(".html")

    ){

      if(

        content.includes("<html") &&

        content.includes("</html>")

      ){

        results.push({

          file:file.name,

          test:"Valid HTML",

          status:"passed"

        });

        passed++;

      }

      else {

        results.push({

          file:file.name,

          test:"Broken HTML",

          status:"failed"

        });

        failed++;

      }

    }

    // =========================
    // JS TEST
    // =========================

    if(

      file.name.endsWith(".js")

    ){

      if(

        content.includes("function") ||

        content.includes("=>")

      ){

        results.push({

          file:file.name,

          test:"JS Logic Found",

          status:"passed"

        });

        passed++;

      }

      else {

        results.push({

          file:file.name,

          test:"Missing JS Logic",

          status:"failed"

        });

        failed++;

      }

    }

    // =========================
    // CSS TEST
    // =========================

    if(

      file.name.endsWith(".css")

    ){

      if(

        content.includes("{") &&

        content.includes("}")

      ){

        results.push({

          file:file.name,

          test:"CSS Structure Valid",

          status:"passed"

        });

        passed++;

      }

      else {

        results.push({

          file:file.name,

          test:"Broken CSS",

          status:"failed"

        });

        failed++;

      }

    }

  }

  // =========================
  // SCORE
  // =========================

  const totalTests =
  passed + failed;

  const score =

    totalTests === 0

    ? 0

    : Math.floor(

        (passed / totalTests)
        * 100

      );

  // =========================
  // FINAL REPORT
  // =========================

  const report = {

    passed,

    failed,

    score,

    productionReady:
    score >= 80,

    results

  };

  // =========================
  // RETURN
  // =========================

  return report;

}

// =========================
// EXPORT
// =========================

module.exports =
testingAgent;

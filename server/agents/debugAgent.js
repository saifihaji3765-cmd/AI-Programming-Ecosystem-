// =========================
// DEBUG AGENT
// =========================

async function debugAgent(

  projectFiles

){

  // =========================
  // ISSUES
  // =========================

  const issues = [];

  // =========================
  // FIXES
  // =========================

  const fixes = [];

  // =========================
  // LOOP FILES
  // =========================

  for(

    const file
    of projectFiles

  ){

    // =========================
    // FILE CONTENT
    // =========================

    const content =
    file.content || "";

    // =========================
    // EMPTY FILE
    // =========================

    if(

      content.trim() === ""

    ){

      issues.push({

        file:file.name,

        problem:
        "Empty file detected"

      });

      fixes.push({

        file:file.name,

        solution:
        "Add starter code"

      });

    }

    // =========================
    // MISSING EXPORT
    // =========================

    if(

      file.name.endsWith(".js") &&

      content.includes(
        "function"
      ) &&

      !content.includes(
        "module.exports"
      )

    ){

      issues.push({

        file:file.name,

        problem:
        "Missing module export"

      });

      fixes.push({

        file:file.name,

        solution:
        "Add module.exports"

      });

    }

    // =========================
    // API KEY SECURITY
    // =========================

    if(

      content.includes(
        "sk-"
      )

    ){

      issues.push({

        file:file.name,

        problem:
        "Hardcoded API key"

      });

      fixes.push({

        file:file.name,

        solution:
        "Move API key to .env"

      });

    }

    // =========================
    // CONSOLE SPAM
    // =========================

    const consoleCount =

      (
        content.match(
          /console\.log/g
        ) || []
      ).length;

    if(

      consoleCount > 10

    ){

      issues.push({

        file:file.name,

        problem:
        "Too many console logs"

      });

      fixes.push({

        file:file.name,

        solution:
        "Clean unnecessary logs"

      });

    }

  }

  // =========================
  // RESULT
  // =========================

  const debugReport = {

    success:
    issues.length === 0,

    totalIssues:
    issues.length,

    issues,

    fixes,

    autoFixAvailable:true

  };

  // =========================
  // RETURN
  // =========================

  return debugReport;

}

// =========================
// EXPORT
// =========================

module.exports =
debugAgent;

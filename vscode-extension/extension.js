const vscode = require("vscode");
const axios = require("axios");

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "aiDevMentor.analyzeCode",
    async function () {
      const editor = vscode.window.activeTextEditor;
      const code = editor.document.getText();

      const res = await axios.post("http://localhost:3000/analyze", {
        code,
        language: "javascript",
      });

      vscode.window.showInformationMessage(
        res.data.result || "Analysis complete"
      );
    }
  );

  context.subscriptions.push(disposable);
}

module.exports = { activate };

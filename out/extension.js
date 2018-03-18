"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function activate(context) {
    console.log("CryProj extension is active");
    // create a new word counter
    let cryEngineVersion = new CryEngineVersion();
    vscode.window.onDidChangeActiveTextEditor((e) => {
        if (isACryProjFile(e)) {
            cryEngineVersion.updateVersion();
        }
        else {
            cryEngineVersion.hideStatusBar();
        }
    });
    // Required as if user opens VS Code with a file already opened it won't trigger
    // the onDidChangeActiveTextEditor, so checks are needed even there
    if (isACryProjFile(vscode.window.activeTextEditor)) {
        cryEngineVersion.updateVersion();
    }
    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(cryEngineVersion);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function isACryProjFile(e) {
    return e.document.fileName.toLowerCase().endsWith(".cryproj");
    // TODO: 
    // When CryProj and JSON files will be two different thinghs, change the line above 
    // with this one
    //return e.document.languageId.toLowerCase() === "cryproj";
}
class CryEngineVersion {
    constructor() {
        this._statusBarVersion = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    }
    updateVersion() {
        // Create as needed
        if (!this._statusBarVersion) {
            this._statusBarVersion = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
        }
        // Get the current text editor
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            this.hideStatusBar();
            return;
        }
        let engineVersion = this._getEngineVersion(editor.document);
        if (engineVersion) {
            // Update the status bar
            this._statusBarVersion.text = engineVersion;
            this._statusBarVersion.show();
        }
        else {
            this.hideStatusBar();
        }
    }
    _getEngineVersion(doc) {
        let docContent = JSON.parse(doc.getText());
        let requireNode = docContent["require"];
        let engineVersion;
        // Check that the "require" node was present in the document
        if (requireNode) {
            // If so get the version of the engine
            engineVersion = requireNode["engine"];
            // If the engine version is set, return it
            if (engineVersion) {
                return engineVersion;
            }
        }
        // Otherwise, return an empty string
        return "";
    }
    dispose() {
        this._statusBarVersion.dispose();
    }
    hideStatusBar() {
        this._statusBarVersion.hide();
    }
}
//# sourceMappingURL=extension.js.map
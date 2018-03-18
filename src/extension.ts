"use strict";

import * as vscode from "vscode";

enum CRYENGINE_VERSIONS {
    "engine-dev",
    "engine-5.4", 
    "engine-5.3",
    "engine-5.2"
}


export function activate(context: vscode.ExtensionContext) {
    console.log("CryProj extension is active");

    // create a new word counter
    let cryEngineVersion = new CryEngineVersion();

    // This will trigger the inner function when user changes file in the editor
    vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor) => {
        if (isACryProjFile(e)) {
            cryEngineVersion.updateVersion();
        } else {
            cryEngineVersion.hideStatusBar();
        }
    });

    // This will be triggered when user changes something in a file
    vscode.window.onDidChangeTextEditorSelection((e: vscode.TextEditorSelectionChangeEvent)=>{
        if(isACryProjFile(e.textEditor)){
            cryEngineVersion.updateVersion();
        }
    })

    // Required as if user opens VS Code with a file already opened it won't trigger
    // the onDidChangeActiveTextEditor, so checks are needed even there
    if (isACryProjFile(vscode.window.activeTextEditor)) {
        cryEngineVersion.updateVersion();
    }
    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(cryEngineVersion);
}

export function deactivate() { }

function isACryProjFile(e: vscode.TextEditor) {
    return e.document.fileName.toLowerCase().endsWith(".cryproj");
    // TODO: 
    // When CryProj and JSON files will be two different thinghs, change the line above 
    // with this one
    //return e.document.languageId.toLowerCase() === "cryproj";
}



class CryEngineVersion {

    private _statusBarVersion: vscode.StatusBarItem =
        vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

    public updateVersion() {

        // Create as needed
        if (!this._statusBarVersion) {
            this._statusBarVersion = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        }

        // Get the current text editor
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            this.hideStatusBar();
            return;
        }


        let engineVersion = this._getEngineVersion(editor.document);

        
        if (engineVersion) {
            // Check if the engineVersion is in the enum of supported CRYENGINE_VERSIONS
            if (engineVersion in CRYENGINE_VERSIONS){
                // Update the status bar
                this._statusBarVersion.text = "CRYENGINE version: " + engineVersion.split("-")[1];
                this._statusBarVersion.show();
            } else {
                // Otherwise return from this method
                return;
            }
        } else {
            this.hideStatusBar();
        }

    }

    public _getEngineVersion(doc: vscode.TextDocument): string {

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

    public hideStatusBar(){
        this._statusBarVersion.hide();
    }
}
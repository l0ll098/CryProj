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

    let statusBarHandler = new StatusBarHandler();
    let extController = new ExtensionController(context, statusBarHandler);

    context.subscriptions.push(statusBarHandler);
    context.subscriptions.push(extController);

    // Register commands
    let command = vscode.commands.registerCommand('extension.setVersion', () => {

        // Get all the supported versions
        let versions: string[] = [];
        for (let key in CRYENGINE_VERSIONS) {
            if (typeof CRYENGINE_VERSIONS[key] === "string") {
                versions.push(CRYENGINE_VERSIONS[key]);
            }
        }

        // Show a menu where user can pick the wanted CRYENGINE version
        vscode.window.showQuickPick(versions).then((version: string) => {
            extController.setWantedCryEngineVersion(version);
        });
    });
    context.subscriptions.push(command);
}

export function deactivate() { }

class ExtensionController {
    private subscriptions: vscode.Disposable[] = [];
    private disposable: vscode.Disposable;

    constructor(context: vscode.ExtensionContext, statusBarHandler: StatusBarHandler) {

        this.subscriptions = [];

        // This will trigger the inner function when user changes file in the editor
        vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor) => {
            if (this.isACryProjFile(e)) {
                statusBarHandler.updateVersion();
            } else {
                statusBarHandler.hideStatusBar();
            }
        }, null, this.subscriptions);

        // This will be triggered when user changes something in a file
        vscode.window.onDidChangeTextEditorSelection((e: vscode.TextEditorSelectionChangeEvent) => {
            if (this.isACryProjFile(e.textEditor)) {
                statusBarHandler.updateVersion();
            }
        }, null, this.subscriptions);

        // Required as if user opens VS Code with a file already opened it won't trigger
        // the onDidChangeActiveTextEditor, so checks are needed even there
        if (this.isACryProjFile(vscode.window.activeTextEditor)) {
            statusBarHandler.updateVersion();
        }
        // Add to a list of disposables which are disposed when this extension is deactivated.
        context.subscriptions.push(statusBarHandler);

        this.disposable = vscode.Disposable.from(...this.subscriptions);
    }

    public dispose() {
        this.disposable.dispose();
    }

    private isACryProjFile(e: vscode.TextEditor): boolean {
        return e.document.fileName.toLowerCase().endsWith(".cryproj");
        // TODO: 
        // When CryProj and JSON files will be two different thinghs, change the line above 
        // with this one
        //return e.document.languageId.toLowerCase() === "cryproj";
    }

    public setWantedCryEngineVersion(version: string) {
        let originalDoc = vscode.window.activeTextEditor.document.getText()
        let modifiedDoc = JSON.parse(originalDoc);

        if (modifiedDoc) {
            // Check that the "require" node was present in the document
            if (modifiedDoc["require"]) {
                // If so set the version of the engine
                modifiedDoc["require"]["engine"] = version;
            } else {
                // Otherwise create a node with that property
                modifiedDoc["require"] = { engine: version };
            }
        }

        // Save the wanted CRYENGINE version to the file
        vscode.window.activeTextEditor.edit((editorBuffer: vscode.TextEditorEdit) => {

            let start = new vscode.Position(0, 0);
            let end = new vscode.Position(vscode.window.activeTextEditor.document.lineCount, 0);
            let documentRange = new vscode.Range(start, end);

            // Get the size in spaces a tab takes
            let tabSize = vscode.window.activeTextEditor.options.tabSize;

            // Replace file content with the new one
            editorBuffer.replace(documentRange, JSON.stringify(modifiedDoc, null, tabSize));

            // Save
            vscode.window.activeTextEditor.document.save();
        });
    }
}


class StatusBarHandler {

    private _statusBarVersion: vscode.StatusBarItem =
        vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

    public updateVersion() {

        // Create as needed
        if (!this._statusBarVersion) {
            this._statusBarVersion = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
            this._statusBarVersion.command = "extension.setVersion";
        } else {
            if (!this._statusBarVersion.command) {
                this._statusBarVersion.command = "extension.setVersion";
            }
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
            if (engineVersion in CRYENGINE_VERSIONS) {
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

    public hideStatusBar() {
        this._statusBarVersion.hide();
    }
}
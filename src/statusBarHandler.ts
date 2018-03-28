import * as vscode from "vscode";
import { CRYENGINE_VERSIONS } from "./types";

export class StatusBarHandler {

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
import * as vscode from "vscode";
import { CRYENGINE_VERSIONS } from "./types";

export class StatusBarHandler {

    private statusBarVersion: vscode.StatusBarItem =
        vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    private statusBarMsgError: any = null;

    public updateVersion() {

        // Create as needed
        if (!this.statusBarVersion) {
            this.statusBarVersion = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
            this.statusBarVersion.command = "CryProj.setVersion";
        } else {
            if (!this.statusBarVersion.command) {
                this.statusBarVersion.command = "CryProj.setVersion";
            }
        }

        // Get the current text editor
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            this.hideStatusBar();
            return;
        }


        let engineVersion = this.getEngineVersion(editor.document);


        if (engineVersion) {
            // Check if the engineVersion is in the enum of supported CRYENGINE_VERSIONS
            if (engineVersion in CRYENGINE_VERSIONS) {
                // Update the status bar
                this.statusBarVersion.text = "CRYENGINE version: " + engineVersion.split("-")[1];
                this.statusBarVersion.show();

                this.statusBarMsgError = vscode.window.setStatusBarMessage("");
            } else {
                // Otherwise return from this method
                return;
            }
        } else {
            this.statusBarMsgError = vscode.window.setStatusBarMessage("Cannot parse engine version. Fix the document and it should work.");
            this.hideStatusBar();
        }

    }

    private getEngineVersion(doc: vscode.TextDocument): string {

        let docContent;
        try {
            docContent = JSON.parse(doc.getText());
            // If the document content has been parsed and an error message was shown, hide it
            if (this.statusBarMsgError) {
                (<vscode.Disposable>this.statusBarMsgError).dispose();
            }
        } catch (e) {
            this.statusBarMsgError = vscode.window.setStatusBarMessage("Cannot parse engine version. Fix the document and it should work.");
            return "";
        }


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
        this.statusBarVersion.dispose();
        if (this.statusBarMsgError) {
            (<vscode.Disposable>this.statusBarMsgError).dispose();
        }
    }

    public hideStatusBar() {
        this.statusBarVersion.hide();
    }
}
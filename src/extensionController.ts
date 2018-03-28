import * as vscode from "vscode";
import { StatusBarHandler } from "./statusBarHandler";
import { IPackageInfo } from "./types";


export class ExtensionController {
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

    public getPackageInfo(context: vscode.ExtensionContext): IPackageInfo | undefined {
        let extensionPackage = require(context.asAbsolutePath('./package.json'));
        if (extensionPackage) {
            return {
                name: extensionPackage.name,
                version: extensionPackage.version
            };
        }
        return void 0;
    }
}

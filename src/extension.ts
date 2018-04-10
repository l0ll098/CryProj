"use strict";

import * as vscode from "vscode";
import { StatusBarHandler } from "./statusBarHandler";
import { ExtensionController } from "./extensionController";
import { CRYENGINE_VERSIONS, getLatestEngineStableVersion } from "./types";
import { SchemasManager } from "./schemasManager";
import { join } from "path";
import * as fs from "fs";


export function activate(context: vscode.ExtensionContext) {
    console.log("CryProj extension is active");

    let statusBarHandler = new StatusBarHandler();
    let extController = new ExtensionController(context, statusBarHandler);
    let schemasManager = new SchemasManager(getLatestEngineStableVersion());

    context.subscriptions.push(statusBarHandler);
    context.subscriptions.push(extController);
    context.subscriptions.push(schemasManager);

    // Register commands
    let command = vscode.commands.registerCommand('CryProj.setVersion', () => {

        // Get all the supported versions
        let quickPickItems: vscode.QuickPickItem[] = [];
        for (let key in CRYENGINE_VERSIONS) {
            if (typeof CRYENGINE_VERSIONS[key] === "string") {
                quickPickItems.push({
                    label: CRYENGINE_VERSIONS[key].split("-")[1],
                    description: CRYENGINE_VERSIONS[key]
                });
            }
        }

        let quickPickOpts: vscode.QuickPickOptions = {
            placeHolder: "Choose the CRYENGINE version you want use"
        };

        // Show a menu where user can pick the wanted CRYENGINE version
        vscode.window.showQuickPick(quickPickItems, quickPickOpts).then((item: vscode.QuickPickItem) => {
            if (item) {
                extController.setWantedCryEngineVersion(item.description);
                schemasManager.setEngineVersion(item.description);

                schemasManager.createSchemaFile(context.asAbsolutePath(join("schemas")));

                // TODO: Reload just Intellisense and not the entire editor
                let btn: vscode.MessageItem = { title: "Ok" };
                vscode.window
                    .showWarningMessage("In order to see updated suggestions, you neeed to restart VS Code", btn)
                    .then((clickedBtn) => {
                        if (clickedBtn) {
                            console.log("Reloading VS Code...");

                            // Save before realoding
                            vscode.window.activeTextEditor.document.save();
                            vscode.commands.executeCommand("workbench.action.reloadWindow");
                        }
                    });
            }
        });
    });
    context.subscriptions.push(command);

    // Check if the schema file exists. If not, create it
    if (!fs.existsSync(context.asAbsolutePath(join("schemas", "cryproj.schema.json")))){
        console.log("Schema file doesn't exist, creating it...");
        schemasManager.createSchemaFile(context.asAbsolutePath(join("schemas")));
    }
}

export function deactivate() { }

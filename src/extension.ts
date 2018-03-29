"use strict";

import * as vscode from "vscode";
import { StatusBarHandler } from "./statusBarHandler";
import { ExtensionController } from "./extensionController";
import { CRYENGINE_VERSIONS } from "./types";


export function activate(context: vscode.ExtensionContext) {
    console.log("CryProj extension is active");

    let statusBarHandler = new StatusBarHandler();
    let extController = new ExtensionController(context, statusBarHandler);

    context.subscriptions.push(statusBarHandler);
    context.subscriptions.push(extController);

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
        }

        // Show a menu where user can pick the wanted CRYENGINE version
        vscode.window.showQuickPick(quickPickItems, quickPickOpts).then((item: vscode.QuickPickItem) => {
            if (item) {
                extController.setWantedCryEngineVersion(item.description);
            }
        });
    });
    context.subscriptions.push(command);
}

export function deactivate() { }

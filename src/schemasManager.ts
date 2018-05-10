"use strict";

import { CRYENGINE_VERSIONS } from "./types";

export class SchemasManager {
    private currentlySelectedEngineVersion: string = "";

    constructor(version: string) {
        this.setEngineVersion(version);
    }

    public setEngineVersion(version: string) {
        if (version in CRYENGINE_VERSIONS) {
            this.currentlySelectedEngineVersion = version;
        } else {
            throw new Error("Unrecognized engine version");
        }
    }


    /**
     * Called on extension deactivation
     */
    public dispose() {

    }
}
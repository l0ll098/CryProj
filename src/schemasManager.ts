"use strict";

import { CRYENGINE_VERSIONS } from "./types";
import * as fs from "fs";

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

    public createSchemaFile(schemaPath: string) {
        let currentVersion = this.currentlySelectedEngineVersion.split("-")[1];
        let version = currentVersion === "dev" ? "dev" : currentVersion.split(".")[0] + currentVersion.split(".")[1];

        fs.unlink(schemaPath + "/cryproj.schema.json", (err) => {
            fs.createReadStream(schemaPath + "/cryproj." + version + ".schema.json").pipe(fs.createWriteStream(schemaPath + "/cryproj.schema.json"));
        });
    }


    /**
     * Called on extension deactivation
     */
    public dispose() {

    }
}
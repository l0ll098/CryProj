export enum CRYENGINE_VERSIONS {
    "engine-dev",
    "engine-5.5",
    "engine-5.4",
    "engine-5.3",
    "engine-5.2"
}

export interface IPackageInfo {
    name: string;
    version: string;
}

export function getLatestEngineStableVersion() {
    for (let version in CRYENGINE_VERSIONS) {
        if (typeof CRYENGINE_VERSIONS[version] === "string" && CRYENGINE_VERSIONS[version] !== "engine-dev") {
            return CRYENGINE_VERSIONS[version].toString();
        }
    }

    return CRYENGINE_VERSIONS["engine-5.4"].toString();
}
export type EnvKeyMigrationScript = (params: {
    deploymentTag: string;
    primaryRegion: string;
    failoverRegion?: string;
    profile: string | undefined;
}) => Promise<void>;
export declare const waitForEnterKeyPromise: (message: string) => Promise<unknown>;
export declare const getMinimumInfraForApi: (apiToInfraVersions: Record<string, string>, apiVersionAny: string) => string;
//# sourceMappingURL=lib.d.ts.map
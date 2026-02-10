import { Client, Api, Model } from "@envkey/core/types";
export declare const encryptedKeyParamsForEnvironments: (params: {
    state: Client.State;
    environmentIds: string[];
    pending?: true;
    newKeysOnly?: boolean;
    reencryptChangesets?: boolean;
    initEnvs?: true;
    context: Client.Context;
}) => Promise<{
    environmentKeysByComposite: Record<string, string>;
    changesetKeysByEnvironmentId: Record<string, string>;
    keys: Api.Net.EnvParams["keys"];
    inheritingEnvironmentIdsByEnvironmentId: Record<string, Set<string>>;
    environmentIdsSet: Set<string>;
    envParentIds: string[];
    baseEnvironmentsByEnvParentId: Record<string, Model.Environment[]>;
}>;
//# sourceMappingURL=encrypted_keys.d.ts.map
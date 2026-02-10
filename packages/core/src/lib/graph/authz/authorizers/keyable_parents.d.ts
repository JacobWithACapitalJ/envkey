import { Graph } from "../../../../types";
export declare const canCreateServer: (graph: Graph.Graph, currentUserId: string, environmentId: string) => boolean, canDeleteServer: (graph: Graph.Graph, currentUserId: string, serverId: string) => boolean, canCreateLocalKey: (graph: Graph.Graph, currentUserId: string, environmentId: string) => boolean, canDeleteLocalKey: (graph: Graph.Graph, currentUserId: string, localKeyId: string) => boolean, canGenerateKey: (graph: Graph.Graph, currentUserId: string, keyableParentId: string) => boolean, canRevokeKey: (graph: Graph.Graph, currentUserId: string, params: {
    generatedEnvkeyId: string;
} | {
    keyableParentId: string;
}) => boolean;
//# sourceMappingURL=keyable_parents.d.ts.map
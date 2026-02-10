import { Graph } from "../../../../types";
export declare const canCreateBlock: (graph: Graph.Graph, currentUserId: string) => boolean, canRenameBlock: (graph: Graph.Graph, currentUserId: string, blockId: string) => boolean, canUpdateBlockSettings: (graph: Graph.Graph, currentUserId: string, blockId: string) => boolean, canDeleteBlock: (graph: Graph.Graph, currentUserId: string, blockId: string) => boolean, canConnectBlock: (graph: Graph.Graph, currentUserId: string, appId: string, blockId: string) => boolean, canDisconnectBlock: (graph: Graph.Graph, currentUserId: string, params: {
    appBlockId: string;
} | {
    appId: string;
    blockId: string;
}) => boolean, canReorderBlocks: (graph: Graph.Graph, currentUserId: string, appId: string, order?: Record<string, number>) => boolean, canListBlockCollaborators: (graph: Graph.Graph, currentUserId: string, blockId: string, userType: "orgUser" | "cliUser") => boolean, canReadBlockVersions: (graph: Graph.Graph, currentUserId: string, blockId: string) => boolean;
//# sourceMappingURL=blocks.d.ts.map
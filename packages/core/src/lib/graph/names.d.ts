import { Graph } from "../../types";
export declare const getEnvironmentName: (graph: Graph.Graph, environmentId: string) => string;
export declare const getGroupObjectTypeLabel: (graph: Graph.Graph, groupId: string) => "team" | "app group" | "block group";
export declare const getGroupObjectTypeLabelCamelized: (graph: Graph.Graph, groupId: string) => "Team" | "App Group" | "Block Group";
export declare const getUserName: (graph: Graph.Graph, userOrDeviceId: string, firstInitialOnly?: boolean, lastNameFirst?: boolean) => string;
export declare const getObjectName: (graph: Graph.Graph, id: string) => string;
//# sourceMappingURL=names.d.ts.map
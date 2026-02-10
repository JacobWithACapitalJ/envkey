import { Graph } from "../../../../types";
export declare const canRenameUser: (graph: Graph.Graph, currentUserId: string, targetUserId: string) => boolean;
export declare const canUpdateUserRole: (graph: Graph.Graph, currentUserId: string, targetUserId: string, newOrgRoleId: string) => boolean;
export declare const canRemoveFromOrg: (graph: Graph.Graph, currentUserId: string, targetUserId: string) => boolean;
export declare const canListOrgUsers: (graph: Graph.Graph, currentUserId: string) => boolean;
export declare const canManageOrgUser: (graph: Graph.Graph, currentUserId: string, orgUserId: string) => boolean;
//# sourceMappingURL=org_users.d.ts.map
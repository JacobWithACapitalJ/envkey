import { Graph } from "../../../../types";
export declare const canCreateApp: (graph: Graph.Graph, currentUserId: string) => boolean, canRenameApp: (graph: Graph.Graph, currentUserId: string, appId: string) => boolean, canUpdateAppSettings: (graph: Graph.Graph, currentUserId: string, appId: string) => boolean, canManageAppFirewall: (graph: Graph.Graph, currentUserId: string, appId: string) => boolean, canDeleteApp: (graph: Graph.Graph, currentUserId: string, appId: string) => boolean, canGrantAppAccess: (graph: Graph.Graph, currentUserId: string, appId: string, userType?: "orgUser" | "cliUser") => boolean, canGrantAppRoleToOrgRole: (graph: Graph.Graph, currentUserId: string, params: {
    appId: string;
    orgRoleId: string;
    appRoleId: string;
}) => boolean, canGrantAppRoleToUser: (graph: Graph.Graph, currentUserId: string, params: {
    appId: string;
    userId: string;
    appRoleId: string;
}) => boolean, canGrantAppRoleToUserGroup: (graph: Graph.Graph, currentUserId: string, params: {
    appId: string;
    userGroupId: string;
    appRoleId: string;
}) => boolean, canRemoveAppAccess: (graph: Graph.Graph, currentUserId: string, appId: string) => boolean, canRemoveAppUserAccess: (graph: Graph.Graph, currentUserId: string, params: {
    appUserGrantId: string;
} | {
    appId: string;
    userId: string;
}) => boolean, canRemoveAppUserGroupAccess: (graph: Graph.Graph, currentUserId: string, params: {
    appUserGroupId: string;
} | {
    appId: string;
    userGroupId: string;
}) => boolean, canListAppCollaborators: (graph: Graph.Graph, currentUserId: string, appId: string, userType: "orgUser" | "cliUser") => boolean, canReadAppVersions: (graph: Graph.Graph, currentUserId: string, appId: string) => boolean;
//# sourceMappingURL=apps.d.ts.map
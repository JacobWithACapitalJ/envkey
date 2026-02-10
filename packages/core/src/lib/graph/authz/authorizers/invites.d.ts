import { Graph, Api } from "../../../../types";
export declare const canInvite: (graph: Graph.Graph, currentUserId: string, params: Pick<Api.Net.ApiParamTypes["CreateInvite"], "appUserGrants" | "userGroupIds"> & {
    orgRoleId: string;
}) => boolean, canInviteToApp: (graph: Graph.Graph, currentUserId: string, appId: string) => boolean, canInviteAny: (graph: Graph.Graph, currentUserId: string) => boolean, canRevokeInvite: (graph: Graph.Graph, currentUserId: string, inviteId: string, now: number) => boolean;
//# sourceMappingURL=invites.d.ts.map
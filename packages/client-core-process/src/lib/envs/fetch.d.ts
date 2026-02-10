import { Client, Model, Api } from "@envkey/core/types";
export declare const fetchEnvsForUserOrAccessParams: (state: Client.State, allParams: {
    userId?: string;
    accessParams?: Model.AccessParams;
}[], context: Client.Context) => Promise<Client.DispatchResult<Client.Action.EnvkeyAction | Client.Action.SuccessAction<Client.Action.EnvkeyAction, any> | Client.Action.FailureAction<Client.Action.EnvkeyAction, Api.Net.ErrorResult>>>, fetchRequiredEnvs: (state: Client.State, requiredEnvs: Set<string>, requiredChangesets: Set<string>, context: Client.Context, skipWaitForReencryption?: true, keysOnly?: boolean) => Promise<Client.DispatchResult | undefined>, fetchLoadedEnvs: (state: Client.State, context: Client.Context, skipWaitForReencryption?: true) => Promise<Client.DispatchResult | undefined>, fetchPendingEnvs: (state: Client.State, context: Client.Context, skipWaitForReencryption?: true) => Promise<Client.DispatchResult | undefined>;
//# sourceMappingURL=fetch.d.ts.map
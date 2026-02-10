import { Client, Api, Crypto } from "@envkey/core/types";
type ContextParams = Pick<Client.Context, "clientId" | "accountIdOrCliKey">;
export declare function getState(store: Client.ReduxStore, context: ContextParams): Client.State;
export declare function getState(procState: Client.ProcState, context: ContextParams): Client.State;
type NewAccountAction = Api.Action.RequestActions["Register" | "AcceptInvite" | "AcceptDeviceGrant" | "RedeemRecoveryKey"];
type NewAccountStateProducer = Client.StateProducer<Client.Action.SuccessAction<NewAccountAction, Api.Net.RegisterResult>, {
    privkey: Crypto.Privkey;
    hostUrl: string;
}>;
export declare const newAccountStateProducer: NewAccountStateProducer;
export declare const waitForStateCondition: (store: _Store<import("../../../../core/src/types/client/state").ProcState, Client.ActionTypeWithContextMeta<Client.Action.EnvkeyAction | Client.Action.SuccessAction<Client.Action.EnvkeyAction, any> | Client.Action.FailureAction<Client.Action.EnvkeyAction, Api.Net.ErrorResult>, any>>, context: ContextParams, conditionFn: (state: Client.State) => boolean, timeout?: number) => Promise<void>;
export {};
//# sourceMappingURL=index.d.ts.map
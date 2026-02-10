import { Draft } from "immer";
import { Store as _Store } from "redux";
import { Graph as _Graph } from "./graph";
import { Action as _Action } from "./action";
import { Logs } from "../logs";
import * as Billing from "../billing";
import { default as _ActionType } from "./action_type";
import { Env as _Env } from "./envs";
import { PersistedProcState as _PersistedProcState, StatePersistenceKey as _StatePersistenceKey } from "./persistence";
import { OrgArchiveV1 as _OrgArchiveV1 } from "./archive";
import { State as _State, PartialAccountState as _PartialAccountState, PartialClientState as _PartialClientState, ProcState as _ProcState } from "./state";
import { Crypto, Api, Auth, Model, Rbac } from "../";
import * as z from "zod";
import { Patch } from "rfc6902";
declare namespace Client {
    export import Graph = _Graph;
    export import ActionType = _ActionType;
    export import Action = _Action;
    export import Env = _Env;
    export type State = _State;
    export type PartialAccountState = _PartialAccountState;
    export type PartialClientState = _PartialClientState;
    export type ProcState = _ProcState;
    export type OrgArchiveV1 = _OrgArchiveV1;
    export type PersistedProcState = _PersistedProcState;
    export type StatePersistenceKey = _StatePersistenceKey;
    export type ReduxStore = _Store<ProcState, ActionTypeWithContextMeta<Action.EnvkeyAction | Action.SuccessAction | Action.FailureAction>>;
    export const defaultClientState: _PartialClientState;
    export const defaultAccountState: _PartialAccountState;
    export const defaultProcState: _ProcState;
    export const lockedState: {
        locked: boolean;
        orgUserAccounts: Record<string, ClientUserAuth>;
        cliKeyAccounts: Record<string, ClientCliAuth>;
        pendingSelfHostedDeployments: PendingSelfHostedDeployment[];
        accountStates: Record<string, _PartialAccountState>;
        clientStates: Record<string, _PartialClientState>;
        defaultAccountId: string;
        defaultDeviceName: string;
        lockoutMs: number;
        requiresPassphrase: true;
        deviceKeyUpdatedAt: number;
        unlockedAt: number;
        lastActiveAt: number;
        networkUnreachable: true;
        selfHostedUpgradesAvailable: {
            api?: AvailableUpgrade;
            infra?: AvailableUpgrade;
        };
        skippedSelfHostedUpgradeAt: number;
        uiLastSelectedAccountId: string;
        uiLastSelectedUrl: string;
        v1UpgradeLoaded: {
            fileName: string;
            encryptionKey: string;
            orgName: string;
            creator: Pick<{
                type?: "orgUser";
                email?: string;
                id?: string;
                uid?: string;
                provider?: "email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted";
                externalAuthProviderId?: string;
                firstName?: string;
                lastName?: string;
                invitedById?: string;
                isCreator?: boolean;
                inviteAcceptedAt?: number;
                orgRoleId?: string;
                deactivatedAt?: number;
                orgRoleUpdatedAt?: number;
                scim?: {
                    providerId?: string;
                    candidateId?: string;
                };
                importId?: string;
                createdAt?: number;
                updatedAt?: number;
                deletedAt?: number;
            }, "email" | "firstName" | "lastName">;
        } & Pick<{
            signature?: string;
            ssoEnabled?: boolean;
            ts?: number;
            stripeCustomerId?: string;
            stripeSubscriptionId?: string;
            numUsers?: number;
            billingInterval?: "month" | "year";
            newProductId?: string;
            freeTier?: boolean;
            signedPresetBilling?: string;
        }, "signature" | "ts" | "stripeCustomerId" | "stripeSubscriptionId" | "numUsers" | "signedPresetBilling">;
        v1IsUpgrading: boolean;
        v1UpgradeError: ClientError;
        v1UpgradeAccountId: string;
        v1ActiveUpgrade: {
            accountId?: string;
            deviceName?: string;
        } & Omit<{
            importOrgUsers: boolean;
            importServers: boolean;
            importLocalKeys: boolean;
            importCliUsers: boolean;
            regenServerKeys: boolean;
            importEnvParentIds?: string[];
            importOrgUserIds?: string[];
            importCliUserIds?: string[];
            isV1Upgrade?: boolean;
            isV1UpgradeIntoExistingOrg?: boolean;
            v1Upgrade?: {
                signature?: string;
                ssoEnabled?: boolean;
                ts?: number;
                stripeCustomerId?: string;
                stripeSubscriptionId?: string;
                numUsers?: number;
                billingInterval?: "month" | "year";
                newProductId?: string;
                freeTier?: boolean;
                signedPresetBilling?: string;
            };
        }, "importCliUsers" | "regenServerKeys" | "importCliUserIds" | "isV1Upgrade"> & Pick<{
            signature?: string;
            ssoEnabled?: boolean;
            ts?: number;
            stripeCustomerId?: string;
            stripeSubscriptionId?: string;
            numUsers?: number;
            billingInterval?: "month" | "year";
            newProductId?: string;
            freeTier?: boolean;
            signedPresetBilling?: string;
        }, "ssoEnabled" | "billingInterval" | "newProductId" | "freeTier">;
        v1UpgradeStatus: "canceled" | "error" | "loaded" | "upgrading" | "finished";
        v1UpgradeAcceptedInvite: boolean;
        v1UpgradeInviteToken: string;
        v1UpgradeEncryptionToken: string;
        v1ClientAliveAt: number;
        cloudProducts: {
            type?: "product";
            id?: string;
            createdAt?: number;
            updatedAt?: number;
            deletedAt?: number;
            name?: string;
            plan?: "enterprise" | "cloud_basics" | "cloud_pro" | "business_cloud";
            maxUsers?: number;
            maxEnvkeyWatchers?: number;
            adjustableQuantity?: boolean;
            ssoEnabled?: boolean;
            teamsEnabled?: boolean;
            customRbacEnabled?: boolean;
            isCloudBasics?: boolean;
        }[];
        cloudPrices: {
            type?: "price";
            id?: string;
            createdAt?: number;
            updatedAt?: number;
            deletedAt?: number;
            name?: string;
            productId?: string;
            interval?: "month" | "year";
            amount?: number;
        }[];
        isLoadingCloudProducts: boolean;
        loadCloudProductsError: ClientError;
        hasV1PendingUpgrade: boolean;
        isCheckingV1PendingUpgrade: boolean;
        checkV1PendingUpgradeError: ClientError;
    };
    export const ACCOUNT_STATE_KEYS: (keyof _PartialAccountState)[];
    export const CLIENT_STATE_KEYS: (keyof _PartialClientState)[];
    export const PROC_STATE_KEYS: (keyof _ProcState)[];
    export const CLIENT_PROC_STATE_KEYS: ("requiresPassphrase" | "lockoutMs" | "orgUserAccounts" | "cliKeyAccounts" | "pendingSelfHostedDeployments" | "defaultAccountId" | "defaultDeviceName" | "deviceKeyUpdatedAt" | "locked" | "unlockedAt" | "lastActiveAt" | "networkUnreachable" | "selfHostedUpgradesAvailable" | "skippedSelfHostedUpgradeAt" | "uiLastSelectedAccountId" | "uiLastSelectedUrl" | "v1UpgradeLoaded" | "v1IsUpgrading" | "v1UpgradeError" | "v1UpgradeAccountId" | "v1ActiveUpgrade" | "v1UpgradeStatus" | "v1UpgradeAcceptedInvite" | "v1UpgradeInviteToken" | "v1UpgradeEncryptionToken" | "v1ClientAliveAt" | "cloudProducts" | "cloudPrices" | "isLoadingCloudProducts" | "loadCloudProductsError" | "hasV1PendingUpgrade" | "isCheckingV1PendingUpgrade" | "checkV1PendingUpgradeError")[];
    export const STATE_PERSISTENCE_KEYS: ("requiresPassphrase" | "lockoutMs" | "accountStates" | "orgUserAccounts" | "cliKeyAccounts" | "pendingSelfHostedDeployments" | "defaultAccountId" | "defaultDeviceName" | "deviceKeyUpdatedAt" | "locked" | "unlockedAt" | "lastActiveAt" | "selfHostedUpgradesAvailable" | "skippedSelfHostedUpgradeAt" | "uiLastSelectedAccountId" | "uiLastSelectedUrl" | "v1UpgradeLoaded" | "v1ActiveUpgrade" | "hasV1PendingUpgrade" | "isCheckingV1PendingUpgrade" | "checkV1PendingUpgradeError")[];
    export type ApiClientName = z.infer<typeof ApiClientNameSchema>;
    export const ApiClientNameSchema: z.ZodEnum<["app", "cli"]>;
    export type FetchClientName = z.infer<typeof FetchClientNameSchema>;
    export const FetchClientNameSchema: z.ZodEnum<["fetch", "source", "nodejs", "ruby", "python", "go", "dotnet", "webpack", "php", "vscode"]>;
    export const ClientNameSchema: z.ZodUnion<[z.ZodEnum<["app", "cli"]>, z.ZodEnum<["fetch", "source", "nodejs", "ruby", "python", "go", "dotnet", "webpack", "php", "vscode"]>, z.ZodEnum<["core", "none", "v1"]>]>;
    export type ClientName = z.infer<typeof ClientNameSchema>;
    export const ALL_CLIENT_NAMES: ClientName[];
    export const ClientParamsSchema: z.ZodObject<{
        clientName: z.ZodUnion<[z.ZodEnum<["app", "cli"]>, z.ZodEnum<["fetch", "source", "nodejs", "ruby", "python", "go", "dotnet", "webpack", "php", "vscode"]>, z.ZodEnum<["core", "none", "v1"]>]>;
        clientVersion: z.ZodString;
        clientOs: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        clientArch: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        clientOsRelease: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        clientName?: "app" | "cli" | "fetch" | "source" | "nodejs" | "ruby" | "python" | "go" | "dotnet" | "webpack" | "php" | "vscode" | "core" | "none" | "v1";
        clientVersion?: string;
        clientOs?: string;
        clientArch?: string;
        clientOsRelease?: string;
    }>;
    export const CORE_PROC_AUTH_TOKEN = "envkey-core-process-auth-34e710d499b12d3a0bdb7bf5b3b038ea";
    export const CORE_PROC_AGENT_NAME = "EnvKey-Client";
    export type ClientParams<ClientNameType extends ClientName = ClientName> = Omit<z.infer<typeof ClientParamsSchema>, "clientName"> & {
        clientName: ClientNameType;
    };
    export type ClientUserAuth = {
        type: "clientUserAuth";
        deviceId: string;
        deviceName: string;
        userId: string;
        orgId: string;
        orgName: string;
        hostUrl: string;
        addedAt: number;
        lastAuthAt: number;
        privkey: Crypto.Privkey;
        token?: string;
        requiresPassphrase: boolean;
        requiresLockout: boolean;
        lockoutMs: number | undefined;
        externalAuthProviderId?: string;
        primaryRegion?: string;
        profile?: string;
        failoverRegion?: string;
    } & Pick<Model.OrgUser, "email" | "provider" | "uid" | "firstName" | "lastName"> & ({
        hostType: "cloud";
        deploymentTag?: undefined;
    } | {
        hostType: "self-hosted";
        deploymentTag: string;
        internalMode?: boolean;
    });
    export type ClientCliAuth = {
        type: "clientCliAuth";
        userId: string;
        orgId: string;
        privkey: Crypto.Privkey;
        hostUrl: string;
        addedAt: number;
        lastAuthAt: number;
    } & ({
        hostType: "cloud";
        deploymentTag?: undefined;
    } | {
        hostType: "self-hosted";
        deploymentTag: string;
    });
    export type PendingSelfHostedDeployment = Omit<ClientUserAuth, "type" | "deviceId" | "userId" | "orgId" | "token" | "lastAuthAt" | "hostType" | "primaryRegion" | "profile" | "failoverRegion"> & {
        type: "pendingSelfHostedDeployment";
        hostType: "self-hosted";
        subdomain: string;
        domain: string;
        deploymentTag: string;
        codebuildLink: string;
        internalMode?: boolean;
        primaryRegion: string;
        profile: string;
        failoverRegion?: string;
    };
    export type FetchError = {
        type: "error";
        error: {
            message: string;
            stack: string;
            code: number;
        };
    };
    export type ClientError = Api.Net.ErrorResult | {
        type: "clientError";
        error: {
            name: string;
            message: string;
        };
    } | FetchError;
    export type DispatchResult<T extends Client.Action.EnvkeyAction | Client.Action.SuccessAction | Client.Action.FailureAction = Client.Action.EnvkeyAction | Client.Action.SuccessAction | Client.Action.FailureAction> = {
        success: boolean;
        resultAction: T;
        state: Client.State;
        retriedWithUpdatedGraph?: true;
    };
    export type ActionParams<ActionType extends Action.EnvkeyAction = Action.EnvkeyAction, SuccessType = any, FailureType = ClientError, DispatchContextType = any, RootActionType extends Action.EnvkeyAction = ActionType> = ClientActionParams<ActionType, DispatchContextType> | AsyncClientActionParams<ActionType, SuccessType, FailureType, DispatchContextType> | ApiActionParams<ActionType, SuccessType, FailureType, DispatchContextType, RootActionType>;
    export type ClientActionParams<ActionType extends Action.EnvkeyAction = Action.EnvkeyAction, DispatchContextType = any> = {
        type: "clientAction";
        actionType: ActionType["type"];
        skipLocalSocketUpdate?: true;
        stateProducer?: StateProducer<ActionType>;
        procStateProducer?: ProcStateProducer<ActionType>;
        handler?: ActionHandler<ActionType, DispatchContextType>;
    };
    export type ApiActionCreatorResult<DispatchContextType = any> = {
        action: Omit<Action.DispatchAction<Api.Action.RequestAction>, "payload"> & {
            payload: Omit<Api.Action.RequestAction["payload"], "envs" | "encryptedByTrustChain">;
        };
        dispatchContext?: DispatchContextType;
    };
    export type AsyncClientActionParams<ActionType extends Action.EnvkeyAction = Action.EnvkeyAction, SuccessType = any, FailureType = ClientError, DispatchContextType = any> = {
        type: "asyncClientAction";
        actionType: ActionType["type"];
        verifyCurrentUser?: true;
        skipLocalSocketUpdate?: true;
        serialAction?: true;
        stateProducer?: StateProducer<ActionType>;
        handler?: AsyncActionHandler<ActionType, SuccessType, FailureType, DispatchContextType>;
        bulkApiDispatcher?: true;
        apiActionCreator?: (payload: ActionType extends {
            payload: any;
        } ? ActionType["payload"] extends any[] ? ActionType["payload"][0] : ActionType["payload"] : any, state: Client.State, context: Client.Context) => Promise<ApiActionCreatorResult<DispatchContextType>>;
        apiSuccessPayloadCreator?: (apiRes: DispatchResult, dispatchContext?: DispatchContextType) => Promise<SuccessType>;
    } & AsyncActionMethods<ActionType, SuccessType, FailureType, DispatchContextType>;
    export type GraphProposer<ActionType extends Action.EnvkeyAction = Api.Action.GraphAction> = (action: ActionType extends Api.Action.GraphAction ? Omit<ActionType, "payload"> & {
        payload: Omit<ActionType["payload"], "envs" | "encryptedByTrustChain">;
    } : ActionType, state: Client.State, context: Client.Context) => (graphDraft: Draft<Client.Graph.UserGraph>) => Client.Graph.UserGraph | void;
    export type ApiActionParams<ActionType extends Action.EnvkeyAction = Api.Action.GraphAction, SuccessType = any, FailureType = ClientError, DispatchContextType = any, RootActionType extends Action.EnvkeyAction = ActionType> = {
        type: "apiRequestAction";
        actionType: Api.ActionType;
        loggableType?: Logs.LoggableType;
        loggableType2?: Logs.LoggableType;
        loggableType3?: Logs.LoggableType;
        loggableType4?: Logs.LoggableType;
        skipProcessRootPubkeyReplacements?: true;
        skipProcessRevocationRequests?: true;
        skipReencryptPermitted?: true;
        serialAction?: true;
        refreshActionCreator?: (requestAction: RootActionType) => Action.EnvkeyAction;
        authenticated?: true;
        graphAction?: true;
        envsUpdate?: true;
        bulkDispatchOnly?: true;
        stateProducer?: StateProducer<ActionType>;
        graphProposer?: GraphProposer<ActionType>;
        encryptedKeysScopeFn?: (graph: Client.Graph.UserGraph, action: ActionType) => Rbac.OrgAccessScope;
    } & AsyncActionMethods<ActionType, SuccessType, FailureType, DispatchContextType>;
    export type LocalSocketUpdateFn = (msg: LocalSocketMessage) => void;
    export type Context<DispatchContextType = any> = {
        client: ClientParams<"cli" | "app" | "core" | "v1">;
        clientId: string;
        accountIdOrCliKey: string | undefined;
        hostUrl?: string;
        dispatchContext?: DispatchContextType;
        store?: ReduxStore;
        auth?: Auth.ApiAuthParams;
        rootClientAction?: Action.ClientAction;
        skipProcessRevocationRequests?: true;
        skipWaitForSerialAction?: true;
        ipTestOverride?: string;
        localSocketUpdate?: LocalSocketUpdateFn;
    };
    type HandlerContext<DispatchContextType, AuthParamsType extends Auth.ApiAuthParams = Auth.ApiAuthParams> = Context<DispatchContextType> & {
        authParams?: AuthParamsType;
    };
    export type ActionTypeWithContextMeta<ActionType, DispatchContextType = any> = ActionType & {
        meta: (ActionType extends {
            meta: {};
        } ? ActionType["meta"] & Context<DispatchContextType> : Context<DispatchContextType>) & {
            tempId: string;
        };
    };
    export type StateProducer<ActionType extends Action.EnvkeyAction | Action.SuccessAction | Action.FailureAction = Action.EnvkeyAction, DispatchContextType = any> = (draft: Draft<State>, action: ActionTypeWithContextMeta<ActionType, DispatchContextType>) => Draft<State> | void;
    export type ProcStateProducer<ActionType extends Action.EnvkeyAction | Action.SuccessAction | Action.FailureAction = Action.EnvkeyAction, DispatchContextType = any> = (draft: Draft<ProcState>, action: ActionTypeWithContextMeta<ActionType, DispatchContextType>) => Draft<ProcState> | void;
    export type ActionHandler<ActionType extends Action.EnvkeyAction = Action.EnvkeyAction, DispatchContextType = any> = (state: State, action: ActionType, context: HandlerContext<DispatchContextType>) => Promise<void>;
    export type AsyncActionHandler<ActionType extends Action.EnvkeyAction = Action.ClientAction, SuccessType = any, FailureType = ClientError, DispatchContextType = any> = (state: State, action: ActionType, dispatchParams: {
        context: HandlerContext<DispatchContextType>;
        dispatchSuccess: (payload: SuccessType, context: HandlerContext<DispatchContextType>) => Promise<DispatchResult>;
        dispatchFailure: (payload: FailureType, context: HandlerContext<DispatchContextType>) => Promise<DispatchResult>;
    }) => Promise<DispatchResult>;
    export type SuccessHandler<ActionType extends Action.EnvkeyAction = Action.EnvkeyAction, SuccessType = any, DispatchContextType = any> = (state: State, action: ActionType, payload: SuccessType, context: HandlerContext<DispatchContextType>) => Promise<void>;
    export type FailureHandler<ActionType extends Action.EnvkeyAction = Action.EnvkeyAction, FailureType = ClientError, DispatchContextType = any> = (state: State, action: ActionType, payload: FailureType, context: HandlerContext<DispatchContextType>) => Promise<void>;
    type FailureMethods<ActionType extends Action.EnvkeyAction, FailureType = ClientError, DispatchContextType = any> = {
        failureStateProducer?: StateProducer<Action.FailureAction<ActionType, FailureType>, DispatchContextType>;
        failureHandler?: FailureHandler<ActionType, FailureType, DispatchContextType>;
    };
    export type AsyncActionMethods<ActionType extends Action.EnvkeyAction, SuccessType = any, FailureType = ClientError, DispatchContextType = any> = {
        successAccountIdFn?: (payload: SuccessType) => string | undefined;
        successStateProducer?: StateProducer<Action.SuccessAction<ActionType, SuccessType>, DispatchContextType>;
        successHandler?: SuccessHandler<ActionType, SuccessType, DispatchContextType>;
        endStateProducer?: StateProducer<Action.SuccessAction<ActionType, SuccessType> | Action.FailureAction<ActionType, FailureType>, DispatchContextType>;
    } & FailureMethods<ActionType, FailureType, DispatchContextType>;
    export type GeneratedEnvkeyResult = {
        keyableParentId: string;
        envkeyIdPart: string;
        encryptionKey: string;
    };
    export type GeneratedInviteResult = {
        user: Pick<Model.OrgUser, "id" | "email" | "firstName" | "lastName" | "provider" | "uid" | "externalAuthProviderId" | "orgRoleId" | "importId">;
        appUserGrants?: Pick<Model.AppUserGrant, "appId" | "appRoleId">[];
    } & {
        identityHash: string;
        encryptionKey: string;
    };
    export type GeneratedDeviceGrantResult = {
        identityHash: string;
        encryptionKey: string;
        granteeId: string;
        createdAt: number;
    };
    export type GeneratedCliUserResult = {
        user: Pick<Model.CliUser, "name" | "orgRoleId">;
        appUserGrants?: Pick<Model.AppUserGrant, "appId" | "appRoleId">[];
        cliKey: string;
    };
    export type GeneratedRecoveryKey = {
        encryptionKey: string;
    };
    type Version = string;
    export type AvailableUpgrade = {
        latest: Version;
        releaseNotes: Record<Version, string>;
    };
    export interface ExternalAuthSetupPayload {
        authType: "accept_invite" | "accept_device_grant";
        emailToken: string;
        encryptionToken: string;
        externalAuthProviderId: string;
        loadActionType: Client.ActionType.LOAD_DEVICE_GRANT | Client.ActionType.LOAD_INVITE;
        orgId: string;
    }
    export type PendingInvite = Pick<Api.Net.ApiParamTypes["CreateInvite"], "user" | "appUserGrants" | "userGroupIds" | "scim" | "v1Token">;
    export type EnvActionStatus = Pick<Client.State, "cryptoStatus" | "isFetchingEnvs" | "isFetchingChangesets" | "isLoadingInvite" | "isLoadingDeviceGrant" | "isLoadingRecoveryKey" | "isProcessingApi">;
    export type ImportStatus = Partial<Pick<Client.State, "importOrgStatus" | "isImportingOrg" | "importOrgError" | "v1UpgradeStatus" | "v1UpgradeError" | "v1UpgradeLoaded" | "v1ClientAliveAt" | "importOrgServerErrors" | "importOrgLocalKeyErrors">>;
    export type LocalSocketMessage = {
        type: "closing";
    } | {
        type: "update";
        accountId: string | undefined;
    } | {
        type: "diffs";
        diffs: Patch;
    } | {
        type: "importStatus";
        status: ImportStatus;
    } | {
        type: "envActionStatus";
        status: EnvActionStatus | undefined;
    };
    export type CoreDispatchResult<ReturnFullStateType extends boolean = false> = ReturnFullStateType extends true ? DispatchResult : Omit<DispatchResult, "state"> & {
        diffs: Patch;
        status: number;
    };
    export type CloudBillingInvoice = Pick<Billing.Invoice, "id" | "createdAt" | "productName" | "refNumber" | "periodString" | "numActiveUsers" | "maxUsers" | "total" | "status">;
    export type CloudBillingStripeFormParams = {
        data: {
            error?: string;
        };
    };
    export type OrgSocketStateSlice = Pick<Client.State, "locked" | "networkUnreachable" | "orgUserAccounts">;
    export type MainToWorkerProcessMessage = {
        type: "v1UpgradeStatus";
        v1UpgradeStatus: Client.State["v1UpgradeStatus"];
        generatedInvites?: Client.State["generatedInvites"];
    } | {
        type: "resolveOrgSockets";
        state: OrgSocketStateSlice;
        skipJitter?: boolean;
    } | {
        type: "mainStarted";
    };
    export type WorkerToMainProcessMessage = {
        type: "workerStarted";
    } | {
        type: "clientAlive";
    } | {
        type: "v1Alive";
    } | {
        type: "v1FinishedUpgrade";
    } | {
        type: "refreshSession";
        userId?: string;
        abortIfError?: boolean;
    } | {
        type: "accountUpdated";
        account: Client.ClientUserAuth;
        message: Api.OrgSocketUpdateMessage;
    };
    export {};
}
export default Client;
//# sourceMappingURL=index.d.ts.map
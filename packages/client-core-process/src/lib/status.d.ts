import { Client, Api } from "@envkey/core/types";
export declare const statusProducers: (statusKey: keyof Client.State, errorKey: keyof Client.State) => Pick<Client.AsyncActionMethods<Client.Action.EnvkeyAction>, "failureStateProducer" | "endStateProducer"> & {
    stateProducer: Client.StateProducer<Client.Action.EnvkeyAction>;
}, objectStatusProducers: (statusKey: keyof Client.State, errorKey: keyof Client.State) => Pick<Client.AsyncActionMethods<Client.Action.EnvkeyAction & {
    payload: {
        id: string;
    };
}>, "failureStateProducer" | "endStateProducer"> & {
    stateProducer: Client.StateProducer<Client.Action.EnvkeyAction & {
        payload: {
            id: string;
        };
    }>;
}, reorderStatusProducers: (reorderType: "appBlock" | "appBlockGroup" | "appGroupBlock" | "appGroupBlockGroup" | "groupMembership") => Pick<Client.ApiActionParams<Api.Action.RequestAction & {
    payload: ({
        appId: string;
    } | {
        appGroupId: string;
    } | {
        blockGroupId: string;
    }) & {
        order: Api.Net.OrderIndexById;
    };
}>, "stateProducer" | "failureStateProducer" | "endStateProducer">, removeObjectProducers: Pick<Client.AsyncActionMethods<Client.Action.EnvkeyAction & {
    payload: {
        id: string;
    };
}, any, Client.ClientError, any>, "endStateProducer" | "failureStateProducer"> & {
    stateProducer: Client.StateProducer<Client.Action.EnvkeyAction & {
        payload: {
            id: string;
        };
    }>;
}, renameObjectProducers: Pick<Client.AsyncActionMethods<Client.Action.EnvkeyAction & {
    payload: {
        id: string;
    };
}, any, Client.ClientError, any>, "endStateProducer" | "failureStateProducer"> & {
    stateProducer: Client.StateProducer<Client.Action.EnvkeyAction & {
        payload: {
            id: string;
        };
    }>;
}, updateSettingsProducers: Pick<Client.AsyncActionMethods<Client.Action.EnvkeyAction & {
    payload: {
        id: string;
    };
}, any, Client.ClientError, any>, "endStateProducer" | "failureStateProducer"> & {
    stateProducer: Client.StateProducer<Client.Action.EnvkeyAction & {
        payload: {
            id: string;
        };
    }>;
}, updateFirewallProducers: Pick<Client.AsyncActionMethods<Client.Action.EnvkeyAction & {
    payload: {
        id: string;
    };
}, any, Client.ClientError, any>, "endStateProducer" | "failureStateProducer"> & {
    stateProducer: Client.StateProducer<Client.Action.EnvkeyAction & {
        payload: {
            id: string;
        };
    }>;
}, updateObjectProducers: Pick<Client.AsyncActionMethods<Client.Action.EnvkeyAction & {
    payload: {
        id: string;
    };
}, any, Client.ClientError, any>, "endStateProducer" | "failureStateProducer"> & {
    stateProducer: Client.StateProducer<Client.Action.EnvkeyAction & {
        payload: {
            id: string;
        };
    }>;
};
//# sourceMappingURL=status.d.ts.map
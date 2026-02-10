import { Draft } from "immer";
import { Client, Api } from "@envkey/core/types";
export declare const deleteProposer: (action: {
    payload: Api.Net.IdParams;
}) => (graphDraft: Draft<Client.Graph.UserGraph>) => void, updateProposer: (action: {
    payload: Api.Net.IdParams;
}) => (graphDraft: Draft<Client.Graph.UserGraph>) => void;
//# sourceMappingURL=graph.d.ts.map
import Client from "../client";
import Api from "../api";
import { Draft } from "immer";
export declare namespace Graph {
    type Graph = Client.Graph.UserGraph | Api.Graph.OrgGraph;
    type GraphObject = Client.Graph.UserGraphObject | Api.Graph.GraphObject;
    type Indexed<T extends GraphObject> = {
        [id: string]: T;
    };
    type MaybeIndexed<T extends GraphObject> = {
        [id: string]: T | undefined;
    };
    type Grouped<T extends GraphObject> = {
        [id: string]: T[];
    };
    type MaybeGrouped<T extends GraphObject> = {
        [id: string]: T[] | undefined;
    };
    type Producer<T extends Graph> = (graphDraft: Draft<T>) => Draft<T> | void;
}
//# sourceMappingURL=index.d.ts.map
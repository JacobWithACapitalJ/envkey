import { Api } from "@envkey/core/types";
export declare const postApiAction: <ActionType extends Api.Action.RequestAction = Api.Action.RequestAction, ResponseType_1 extends Api.Net.ApiResult = Api.Net.ApiResult>(action: ActionType, hostUrlArg?: string, ipOverride?: string, numRetry?: number) => Promise<ResponseType_1>;
//# sourceMappingURL=index.d.ts.map
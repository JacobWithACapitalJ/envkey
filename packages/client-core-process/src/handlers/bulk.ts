import { Api } from "@envkey/core/types";
import { clientAction } from "../handler";

clientAction<Api.Action.BulkGraphAction>({
  type: "apiRequestAction",
  actionType: Api.ActionType.BULK_GRAPH_ACTION,
  loggableType: undefined,
  authenticated: true,
  graphAction: true,
});

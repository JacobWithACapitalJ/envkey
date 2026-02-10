"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@envkey/core/types");
const handler_1 = require("../handler");
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.BULK_GRAPH_ACTION,
    loggableType: undefined,
    authenticated: true,
    graphAction: true,
});
//# sourceMappingURL=bulk.js.map
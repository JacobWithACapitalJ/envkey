"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("../handler");
const types_1 = require("@envkey/core/types");
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.NETWORK_UNREACHABLE,
    procStateProducer: (draft) => {
        draft.networkUnreachable = true;
    },
});
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.NETWORK_REACHABLE,
    procStateProducer: (draft) => {
        delete draft.networkUnreachable;
    },
});
//# sourceMappingURL=connection_status.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("../handler");
const types_1 = require("@envkey/core/types");
const handler_2 = require("../handler");
const cliVersion = process.env.ENVKEY_CLI_BUILD_VERSION || "2.0.0";
const logger_1 = require("@envkey/core/lib/utils/logger");
const FETCH_MIN_DELAY = 400, // gentle throttling of graph refresh requests
FETCH_JITTER_MAX = 200, fetchTimeouts = {};
(0, handler_1.clientAction)({
    type: "asyncClientAction",
    actionType: types_1.Client.ActionType.RECEIVED_ORG_SOCKET_MESSAGE,
    handler: async (state, { payload: { account, message } }, { context, dispatchSuccess, dispatchFailure }) => {
        if (fetchTimeouts[account.userId]) {
            clearTimeout(fetchTimeouts[account.userId]);
            delete fetchTimeouts[account.userId];
        }
        // add some jitter so we don't slam the server with fetch requests
        // at the exact same time when many clients are connected
        const jitter = Math.round(Math.random() * FETCH_JITTER_MAX);
        (0, logger_1.log)(`Fetching updated graph for ${account.orgName} with delay + jitter of ${FETCH_MIN_DELAY + jitter}ms...`);
        return new Promise((resolve) => {
            fetchTimeouts[account.userId] = setTimeout(async () => {
                var _a, _b;
                delete fetchTimeouts[account.userId];
                const res = await (0, handler_2.dispatch)({
                    type: types_1.Client.ActionType.REFRESH_SESSION,
                }, {
                    client: {
                        clientName: "core",
                        clientVersion: cliVersion,
                    },
                    clientId: "core",
                    accountIdOrCliKey: account.userId,
                });
                if (res.success) {
                    (0, logger_1.log)("Socket-triggered GET_SESSION success: " + account.email);
                    resolve(dispatchSuccess(null, context));
                }
                else {
                    (0, logger_1.log)("Socket-triggered GET_SESSION *failed*: " + account.email, (_a = res.resultAction) === null || _a === void 0 ? void 0 : _a.payload);
                    resolve(dispatchFailure((_b = res.resultAction) === null || _b === void 0 ? void 0 : _b.payload, context));
                }
            }, FETCH_MIN_DELAY + jitter);
        });
    },
});
//# sourceMappingURL=socket.js.map
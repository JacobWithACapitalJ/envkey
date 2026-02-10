"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postApiAction = void 0;
const env_1 = require("@envkey/client-shared/src/env");
const got_1 = __importDefault(require("got"));
const logger_1 = require("@envkey/core/lib/utils/logger");
const wait_1 = require("@envkey/core/lib/utils/wait");
// very unaggressive timeouts
// we want to tolerate slow/weird network conditions, but also not hang too long if server is hopelessly unreachable
const TIMEOUTS = {
    lookup: 3000,
    connect: 10000,
    secureConnect: 10000,
    request: 10 * 60 * 1000,
};
const postApiAction = async (action, 
// hostname sans protocol
hostUrlArg, ipOverride, // for testing firewall
numRetry = 0) => {
    const start = Date.now();
    const hostUrl = "https://" + (hostUrlArg !== null && hostUrlArg !== void 0 ? hostUrlArg : (0, env_1.getDefaultApiHostUrl)());
    const actionUrl = hostUrl + "/action";
    if (process.env.LOG_REQUESTS) {
        (0, logger_1.log)(`POST action ${action.type} to host: ` +
            hostUrl +
            (numRetry > 0 ? ` | retry ${numRetry}` : ``) +
            ` | ${Buffer.byteLength(JSON.stringify(action))} bytes`);
    }
    return got_1.default
        .post(actionUrl, Object.assign({ json: action, timeout: TIMEOUTS, throwHttpErrors: false }, (ipOverride
        ? {
            headers: {
                "x-forwarded-for": ipOverride,
            },
        }
        : {})))
        .then(async (res) => {
        if (process.env.LOG_REQUESTS) {
            (0, logger_1.log)(`RESPONSE to ${action.type} (${hostUrl}): status ${res.statusCode}, ${Buffer.byteLength(res.rawBody)} bytes, elapsed: ${Date.now() - start}ms`);
        }
        if (res.statusCode >= 400) {
            let fetchErr;
            if ((res.statusCode == 502 ||
                res.statusCode == 503 ||
                res.statusCode == 504) &&
                numRetry < 2) {
                if (process.env.LOG_REQUESTS) {
                    (0, logger_1.log)(`ERROR: ${action.type} (${hostUrl}) | ${res.statusCode} error | retrying`);
                }
                await (0, wait_1.wait)((numRetry + 1) * 1500);
                return (0, exports.postApiAction)(action, hostUrlArg, ipOverride, numRetry + 1);
            }
            try {
                const json = JSON.parse(res.body);
                if (process.env.LOG_REQUESTS) {
                    (0, logger_1.log)(`ERROR: ${action.type} (${hostUrl}) | json error`, json);
                }
                fetchErr = json;
            }
            catch (err) {
                if (process.env.LOG_REQUESTS) {
                    (0, logger_1.log)(`ERROR: ${action.type} (${hostUrl}) | text error` + res.body);
                }
                fetchErr = {
                    type: "error",
                    error: {
                        message: res.body,
                        stack: err.stack,
                        code: res.statusCode,
                    },
                };
            }
            throw fetchErr;
        }
        if (res.statusCode == 304) {
            return {
                type: "notModified",
                status: 304,
            };
        }
        return JSON.parse(res.body);
    });
};
exports.postApiAction = postApiAction;
//# sourceMappingURL=index.js.map
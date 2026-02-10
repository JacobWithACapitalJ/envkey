"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("../handler");
const types_1 = require("@envkey/core/types");
const parse_1 = require("@envkey/core/lib/parse");
const client_1 = require("@envkey/core/lib/client");
const fs_1 = __importDefault(require("fs"));
(0, handler_1.clientAction)({
    type: "clientAction",
    actionType: types_1.Client.ActionType.EXPORT_ENVIRONMENT,
    handler: async (state, { payload: { envParentId, environmentId, format, includeAncestors, pending, filePath, }, }) => {
        const rawEnvFn = includeAncestors ? client_1.getRawEnvWithAncestors : client_1.getRawEnv, rawEnv = rawEnvFn(state, { envParentId, environmentId }, pending), txt = (0, parse_1.rawEnvToTxt)(rawEnv, format);
        // write the file
        return new Promise((resolve, reject) => fs_1.default.writeFile(filePath, txt, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        }));
    },
});
//# sourceMappingURL=export.js.map
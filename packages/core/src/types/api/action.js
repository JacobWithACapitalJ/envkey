"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const net_1 = require("./net");
const client_1 = __importDefault(require("../client"));
const action_type_1 = __importDefault(require("./action_type"));
const z = __importStar(require("zod"));
var Action;
(function (Action) {
    Action.FetchEnvkeyActionSchema = z.object({
        type: z.literal(action_type_1.default.FETCH_ENVKEY),
        payload: net_1.Net.ApiParamSchemas[action_type_1.default.FETCH_ENVKEY],
        meta: z.object({
            loggableType: z.literal("fetchEnvkeyAction"),
            fetchServiceVersion: z.string(),
            client: client_1.default.ClientParamsSchema,
        }),
    });
})(Action || (exports.Action = Action = {}));
//# sourceMappingURL=action.js.map
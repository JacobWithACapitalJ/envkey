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
const action_type_1 = __importDefault(require("./action_type"));
const persistence_1 = require("./persistence");
const state_1 = require("./state");
const z = __importStar(require("zod"));
var Client;
(function (Client) {
    Client.ActionType = action_type_1.default;
    Client.defaultClientState = state_1.defaultClientState;
    Client.defaultAccountState = state_1.defaultAccountState;
    Client.defaultProcState = state_1.defaultProcState;
    Client.lockedState = state_1.lockedState;
    Client.ACCOUNT_STATE_KEYS = state_1.ACCOUNT_STATE_KEYS;
    Client.CLIENT_STATE_KEYS = state_1.CLIENT_STATE_KEYS;
    Client.PROC_STATE_KEYS = state_1.PROC_STATE_KEYS;
    Client.CLIENT_PROC_STATE_KEYS = state_1.CLIENT_PROC_STATE_KEYS;
    Client.STATE_PERSISTENCE_KEYS = persistence_1.STATE_PERSISTENCE_KEYS;
    Client.ApiClientNameSchema = z.enum(["app", "cli"]);
    Client.FetchClientNameSchema = z.enum([
        "fetch",
        "source",
        "nodejs",
        "ruby",
        "python",
        "go",
        "dotnet",
        "webpack",
        "php",
        "vscode",
        //  "java",
        // "rust",
        // "erlang",
        // "elixir",
        // "clojure",
        // "scala",
        // "haskell",
        // "julia",
        // "r",
        // "c",
        // "c++",
        // "lua",
    ]);
    Client.ClientNameSchema = z.union([
        Client.ApiClientNameSchema,
        Client.FetchClientNameSchema,
        z.enum([
            "core", // for actions initiated by the core itself
            "none",
            "v1",
        ]),
    ]);
    Client.ALL_CLIENT_NAMES = [
        "app",
        "cli",
        "core",
        "fetch",
        "source",
        "nodejs",
        "ruby",
        "python",
        "go",
        "dotnet",
        "webpack",
        "php",
        "vscode",
    ];
    Client.ClientParamsSchema = z.object({
        clientName: Client.ClientNameSchema,
        clientVersion: z.string(),
        clientOs: z.string().optional(),
        clientArch: z.string().optional(),
        clientOsRelease: z.string().optional(),
    });
    // 👇 for core proc auth: symmetric encryption/decryption by device key (lives in os credential store)
    // passed via user-agent to core process local express server routes
    Client.CORE_PROC_AUTH_TOKEN = "envkey-core-process-auth-34e710d499b12d3a0bdb7bf5b3b038ea";
    Client.CORE_PROC_AGENT_NAME = "EnvKey-Client";
})(Client || (Client = {}));
exports.default = Client;
//# sourceMappingURL=index.js.map
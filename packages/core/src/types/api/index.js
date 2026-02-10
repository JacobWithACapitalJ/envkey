"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const net_1 = require("./net");
const action_1 = require("./action");
const action_type_1 = __importDefault(require("./action_type"));
const graph_1 = require("./graph");
const v1_upgrade_1 = require("./v1_upgrade");
var Api;
(function (Api) {
    Api.Db = db_1.Db;
    Api.Net = net_1.Net;
    Api.Action = action_1.Action;
    Api.ActionType = action_type_1.default;
    Api.Graph = graph_1.Graph;
    Api.V1Upgrade = v1_upgrade_1.V1Upgrade;
    class ApiError extends Error {
        constructor(message, code) {
            super(message);
            this.code = code;
            return this;
        }
    }
    Api.ApiError = ApiError;
})(Api || (Api = {}));
exports.default = Api;
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openExternalUrl = void 0;
const open_1 = __importDefault(require("open"));
const openExternalUrl = (url) => {
    (0, open_1.default)(url, { newInstance: true });
};
exports.openExternalUrl = openExternalUrl;
//# sourceMappingURL=open.js.map
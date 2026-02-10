"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upTo1Sec = exports.wait = void 0;
const wait = (waitMillis) => new Promise((resolve) => setTimeout(() => resolve(), waitMillis));
exports.wait = wait;
const upTo1Sec = () => Math.ceil(Math.random() * 1000);
exports.upTo1Sec = upTo1Sec;
//# sourceMappingURL=wait.js.map
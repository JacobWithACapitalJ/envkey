"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWorkerToMainMessage = exports.kill = exports.sendMainToWorkerMessage = exports.handleWorkerToMainMessage = exports.waitForStart = exports.setWorker = void 0;
const cluster_1 = __importDefault(require("cluster"));
const logger_1 = require("@envkey/core/lib/utils/logger");
let worker;
const setWorker = (w) => {
    if (!cluster_1.default.isMaster) {
        throw new Error("procStatusWorker.setWorker not called from master");
    }
    (0, logger_1.log)("procStatusWorker.setWorker", { w: !!w });
    worker = w;
};
exports.setWorker = setWorker;
const waitForStart = async () => {
    (0, logger_1.log)("procStatusWorker.waitForStart");
    if (!cluster_1.default.isMaster) {
        throw new Error("procStatusWorker.waitForStart not called from master");
    }
    return new Promise((resolve) => {
        const onWorkerStart = (message) => {
            (0, logger_1.log)("procStatusWorker.waitForStart - onWorkerStart", { message });
            if (message.type == "workerStarted") {
                (0, logger_1.log)("Status worker started", { isConnected: worker === null || worker === void 0 ? void 0 : worker.isConnected() });
                worker.off("message", onWorkerStart);
                resolve();
            }
        };
        worker.on("message", onWorkerStart);
    });
};
exports.waitForStart = waitForStart;
const handleWorkerToMainMessage = (handler) => {
    if (!worker) {
        throw new Error("procStatusWorker not initialized");
    }
    if (!cluster_1.default.isMaster) {
        throw new Error("procStatusWorker.handleWorkerToMainMessage not called from master");
    }
    worker.on("message", handler);
};
exports.handleWorkerToMainMessage = handleWorkerToMainMessage;
const sendMainToWorkerMessage = (message) => {
    if (process.env.NODE_ENV == "test") {
        return;
    }
    if (!worker) {
        throw new Error("procStatusWorker not initialized");
    }
    if (!cluster_1.default.isMaster) {
        throw new Error("procStatusWorker.sendMainToWorkerMessage not called from master");
    }
    // log("procStatusWorker.sendMainToWorkerMessage", {
    //   type: message.type,
    // });
    worker.send(message);
};
exports.sendMainToWorkerMessage = sendMainToWorkerMessage;
const kill = (signal = "SIGTERM") => {
    if (!worker) {
        throw new Error("procStatusWorker not initialized");
    }
    if (!cluster_1.default.isMaster) {
        throw new Error("procStatusWorker.kill not called from master");
    }
    (0, logger_1.log)("procStatusWorker.kill", { signal });
    try {
        worker.kill(signal);
    }
    catch (err) {
        (0, logger_1.log)("procStatusWorker.kill error", { err });
    }
};
exports.kill = kill;
const sendWorkerToMainMessage = (message) => {
    if (!cluster_1.default.isWorker) {
        throw new Error("procStatusWorker.sendWorkerToMainMessage not called from worker");
    }
    if (!process.send) {
        throw new Error("procStatusWorker.sendWorkerToMainMessage process.send not defined");
    }
    // log("procStatusWorker.sendWorkerToMainMessage", {
    //   message,
    //   trace: new Error().stack,
    // });
    process.send(message);
};
exports.sendWorkerToMainMessage = sendWorkerToMainMessage;
//# sourceMappingURL=proc_status_worker.js.map
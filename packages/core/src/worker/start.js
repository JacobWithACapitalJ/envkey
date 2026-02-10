"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminateWorkerPool = exports.getProxy = void 0;
const workerpool_1 = __importDefault(require("workerpool"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const cluster_1 = __importDefault(require("cluster"));
const logger_1 = require("../lib/utils/logger");
let workerPath;
if (process.env["WORKER_PATH_FROM_ELECTRON_RESOURCES"] &&
    process.resourcesPath) {
    // Electron in production
    workerPath = path_1.default.resolve(process.resourcesPath, process.env["WORKER_PATH_FROM_ELECTRON_RESOURCES"]);
}
else if (process.env["WORKER_PATH"]) {
    // CLI
    workerPath = path_1.default.join(__dirname, process.env.WORKER_PATH);
}
else {
    // development
    workerPath = path_1.default.resolve(__dirname, "../../build/worker.js");
}
const numCpus = os_1.default.cpus().length;
const numWorkers = cluster_1.default.isMaster ? numCpus : 1;
if (!process.env.IS_TEST) {
    (0, logger_1.log)("starting background worker threads", {
        numCpus,
        numWorkers,
        isMaster: cluster_1.default.isMaster,
        isWorker: cluster_1.default.isWorker,
    });
}
let workerPool = workerpool_1.default.pool(workerPath, {
    workerType: "thread",
    maxWorkers: numWorkers,
    minWorkers: "max",
}), proxyPromise = workerPool.proxy();
const getProxy = async () => {
    const res = await proxyPromise;
    return res;
};
exports.getProxy = getProxy;
const terminateWorkerPool = async () => {
    if (workerPool) {
        await workerPool.terminate(true, 200);
    }
    workerPool = null;
    proxyPromise = null;
};
exports.terminateWorkerPool = terminateWorkerPool;
//# sourceMappingURL=start.js.map
"use strict";
// Production logger is all on one line, and omits date, which suits cloudwatch better.
// Cloudwatch already logs the date, and has a tree collapse feature.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCircularReplacer = exports.logWithElapsed = exports.initFileLogger = exports.logDevOnly = exports.logStderr = exports.log = void 0;
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const serialize_error_1 = require("serialize-error");
const cluster_1 = __importDefault(require("cluster"));
const noop = (...args) => { };
const logdir = path_1.default.resolve(os_1.default.homedir(), `.envkey/logs`);
// log files are initialized on startup, once
const createAndOpenLogFile = (logName) => {
    mkdirp_1.default.sync(logdir);
    const today = new Date().toISOString().split("T")[0];
    // keeps only 10 log files
    const oldLogFiles = fs_1.default
        .readdirSync(logdir)
        .filter((fileName) => fileName.startsWith(logName));
    if (oldLogFiles.length > 10) {
        Promise.all(oldLogFiles
            .sort()
            .reverse()
            .slice(10)
            .map((filename) => fs_1.default.promises.unlink(`${logdir}/${filename}`))).catch((err) => console.error(err));
    }
    const logFileLoc = path_1.default.resolve(logdir, `${logName}-${today}.log`);
    console.error("will write to log file at ", logFileLoc);
    try {
        const fd = fs_1.default.createWriteStream(logFileLoc, { flags: "a" });
        return fd;
    }
    catch (err) {
        console.error("Failed creating core_process log file!", logFileLoc, err);
        throw err;
    }
};
let outstream;
process.on("exit", () => {
    if (!outstream) {
        return;
    }
    try {
        outstream.close();
        outstream = undefined; // prevent "write after close" as logger will only write to std
    }
    catch (err) {
        console.error("failed closing logger outstream on shutdown", err);
    }
});
const logWithLogger = (stdioName, spaces, msg, data) => {
    // cannot save process.stdout.write directly, lest it will crash
    const write = (s) => {
        if (outstream) {
            outstream.write(s);
        }
        process[stdioName].write(s);
    };
    const ts = new Date().toISOString();
    if (process.env.NODE_ENV !== "production") {
        write(ts + (cluster_1.default.isWorker ? " [status-worker]" : " [main]") + " -- ");
    }
    const frontPropsLogged = {
        msg, // for easier reading in prod, put msg key first
    };
    if (stdioName === "stderr") {
        frontPropsLogged.alert = true;
    }
    const logObj = Object.assign(Object.assign({ ts, proc: cluster_1.default.isWorker ? "status-worker" : "main" }, frontPropsLogged), data);
    // dev logger, multiline with ms diff
    if (spaces) {
        delete logObj.msg;
        write(msg);
        if (data) {
            const json = JSON.stringify(logObj, (0, exports.getCircularReplacer)(), spaces);
            write(" " + json);
        }
        write("\n");
        return;
    }
    // prod logger, all on one line
    write(JSON.stringify(logObj, (0, exports.getCircularReplacer)()) + "\n");
};
const spaces = process.env.NODE_ENV === "production" ? 0 : 2;
const log = (msg, data) => {
    if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
        console.log(msg, data);
        return;
    }
    logWithLogger("stdout", spaces, msg, data);
};
exports.log = log;
const logStderr = (msg, data) => logWithLogger("stderr", spaces, msg, data);
exports.logStderr = logStderr;
const logDevOnly = (msg, data) => process.env.NODE_ENV === "production"
    ? noop
    : logWithLogger("stdout", spaces, "<dev only> " + msg, data);
exports.logDevOnly = logDevOnly;
const initFileLogger = (name) => {
    if (!outstream) {
        outstream = createAndOpenLogFile(name);
        (0, exports.log)(`logger initialized with name ${name}`);
        return;
    }
    console.error("Cannot initFileLogger with name as already initialized", name, outstream.path);
};
exports.initFileLogger = initFileLogger;
const logWithElapsed = (lbl, now, obj = {}) => (0, exports.log)(lbl, Object.assign(Object.assign({}, obj), { elapsed: (Date.now() - now).toString() + "ms" }));
exports.logWithElapsed = logWithElapsed;
// Prevents: `TypeError: cyclic object value`
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        const t = typeof value;
        if (t === "object" && value !== null) {
            if (seen.has(value)) {
                return `[object ${key}]`;
            }
            seen.add(value);
        }
        // functions are normally omitted by JSON.stringify
        if (t === "function" && value !== null) {
            const funcString = value.toString();
            return funcString;
        }
        if (value instanceof Error) {
            return (0, serialize_error_1.serializeError)(value);
        }
        return value;
    };
};
exports.getCircularReplacer = getCircularReplacer;
//# sourceMappingURL=logger.js.map
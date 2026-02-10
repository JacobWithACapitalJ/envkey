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
exports.rawEnvToTxt = exports.toDotEnv = exports.toYaml = exports.parseMultiFormat = exports.parseDotenv = exports.parseYaml = exports.parseJson = void 0;
const R = __importStar(require("ramda"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const dotenv = (src) => {
    const obj = {};
    // convert Buffers before splitting into lines and processing
    src.split("\n").forEach(function (line) {
        // matching "KEY' and 'VAL' in 'KEY=VAL'
        const keyValueArr = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
        // matched?
        if (keyValueArr != null) {
            const key = keyValueArr[1];
            // default undefined or missing values to empty string
            let value = keyValueArr[2] ? keyValueArr[2] : "";
            // expand newlines in quoted values
            const len = value ? value.length : 0;
            if (len > 0 &&
                value.charAt(0) === '"' &&
                value.charAt(len - 1) === '"') {
                value = value.replace(/\\n/gm, "\n");
            }
            // remove any surrounding quotes and extra spaces
            value = value.replace(/(^['"]|['"]$)/g, "").trim();
            obj[key] = value;
        }
    });
    return obj;
}, stringifyValues = (obj) => R.map((v) => (v && typeof v != "string" ? JSON.stringify(v) : v), obj);
const parseJson = (txt) => {
    let parsedJson;
    if (txt.startsWith("{") && txt.endsWith("}")) {
        parsedJson = null;
        try {
            parsedJson = JSON.parse(txt);
        }
        catch (e) { }
        if (parsedJson)
            return stringifyValues(parsedJson);
    }
    return null;
}, parseYaml = (txt) => {
    let parsedYaml;
    try {
        parsedYaml = js_yaml_1.default.safeLoad(txt, { schema: js_yaml_1.default.FAILSAFE_SCHEMA });
    }
    catch (e) { }
    if (parsedYaml && typeof parsedYaml == "object" && !R.isEmpty(parsedYaml)) {
        return stringifyValues(parsedYaml);
    }
    return null;
}, parseDotenv = (txt) => {
    let parsedDotenv;
    try {
        parsedDotenv = dotenv(txt);
    }
    catch (e) { }
    if (parsedDotenv && !R.isEmpty(parsedDotenv))
        return parsedDotenv;
    return null;
}, parseMultiFormat = (txt, formats = ["json", "yaml", "env"]) => {
    if (formats.includes("json")) {
        const parsedJson = (0, exports.parseJson)(txt);
        if (parsedJson)
            return parsedJson;
    }
    if (formats.includes("yaml")) {
        const parsedYaml = (0, exports.parseYaml)(txt);
        if (parsedYaml)
            return parsedYaml;
    }
    if (formats.includes("env")) {
        const parsedDotenv = (0, exports.parseDotenv)(txt);
        if (parsedDotenv)
            return parsedDotenv;
    }
    return null;
}, toYaml = (obj) => js_yaml_1.default.safeDump(JSON.parse(JSON.stringify(obj)), {
    schema: js_yaml_1.default.FAILSAFE_SCHEMA,
}), toDotEnv = (obj) => {
    let s = "";
    for (let k in obj) {
        if (!obj[k] && obj[k] != "")
            continue;
        if (s) {
            s += "\n";
        }
        s += `${k}=`;
        if (obj[k] === "") {
            s += "";
        }
        else {
            s += `'${obj[k].replace("'", "\\'")}'`;
        }
    }
    return s;
}, rawEnvToTxt = (rawEnv, format) => {
    let txt;
    if (format == "json") {
        txt = JSON.stringify(rawEnv);
    }
    else if (format == "json-pretty") {
        txt = JSON.stringify(rawEnv, null, 2);
    }
    else if (format == "yaml") {
        txt = (0, exports.toYaml)(rawEnv);
    }
    else if (format == "env") {
        txt = (0, exports.toDotEnv)(rawEnv);
    }
    else {
        throw new Error("unsupported format");
    }
    return txt;
};
exports.parseJson = parseJson, exports.parseYaml = parseYaml, exports.parseDotenv = parseDotenv, exports.parseMultiFormat = parseMultiFormat, exports.toYaml = toYaml, exports.toDotEnv = toDotEnv, exports.rawEnvToTxt = rawEnvToTxt;
//# sourceMappingURL=index.js.map
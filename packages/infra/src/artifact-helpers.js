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
exports.getReleaseAsset = exports.readReleaseNotesFromS3 = exports.listVersionsGT = exports.listVersionsGTE = exports.getLatestReleaseVersion = exports.listObjects = exports.getReleaseObject = exports.getCredentials = void 0;
const stack_constants_1 = require("./stack-constants");
const semver = __importStar(require("semver"));
const aws_sdk_1 = require("aws-sdk");
const node_fetch_1 = __importDefault(require("node-fetch"));
const fast_xml_parser_1 = __importDefault(require("fast-xml-parser"));
const wait_1 = require("@envkey/core/lib/utils/wait");
// These artifact-helpers must stay agnostic to the environment. Be careful about
// using any stack-constants.
// The AWS SDK simply doesn't work without credentials. For customers to use the S3 API, they must hit it
// directly. That is why below, every customer-used s3 request will be different depending on whether credentials
// were passed to the function.
const getCredentials = (params) => {
    if (params.profile) {
        return new aws_sdk_1.SharedIniFileCredentials({
            profile: params.profile,
        });
    }
    if (params.creds) {
        return new aws_sdk_1.Credentials(params.creds);
    }
    return undefined;
};
exports.getCredentials = getCredentials;
const getReleaseObject = async (params) => {
    const credentials = (0, exports.getCredentials)(params);
    if (credentials) {
        const s3 = new aws_sdk_1.S3({ credentials, region: stack_constants_1.RELEASE_ASSET_REGION });
        console.log("FETCHING release object from s3:", JSON.stringify({ bucket: params.bucket, key: params.key }));
        const { Body } = await s3
            .getObject({
            Bucket: params.bucket,
            Key: params.key,
        })
            .promise();
        return Body;
    }
    const url = `https://${params.bucket}.s3.amazonaws.com/${params.key}`;
    // console.log("fetching release object:", url);
    const res = await (0, node_fetch_1.default)(url);
    // console.log("fetched release object:", url);
    if (params.progress) {
        const totalBytes = Number(res.headers.get("content-length"));
        let downloadedBytes = 0;
        res.body.on("data", (chunk) => {
            downloadedBytes += chunk.length;
            params.progress(totalBytes, downloadedBytes);
        });
    }
    return res.buffer();
};
exports.getReleaseObject = getReleaseObject;
const listObjects = async (params) => {
    var _a, _b, _c;
    const { credentials, bucket, prefix } = params;
    let output;
    if (credentials) {
        const s3 = new aws_sdk_1.S3({ region: stack_constants_1.RELEASE_ASSET_REGION, credentials });
        const res = await s3
            .listObjectsV2({
            Bucket: bucket,
            Prefix: prefix,
            MaxKeys: 1000,
        })
            .promise();
        if (!res.Contents) {
            throw new Error("Unexpected response listing versions: " + JSON.stringify(res));
        }
        output = res.Contents.map((o) => ({
            key: o.Key,
            // https://github.com/aws/aws-sdk-net/issues/815#issuecomment-352466303
            etag: o.ETag.replace(/"/g, ""),
        }));
    }
    else {
        const x = await (0, node_fetch_1.default)(`https://${bucket}.s3.amazonaws.com/?list-type=2&prefix=${encodeURIComponent(prefix)}`).then((res) => res.text());
        const parsedX = fast_xml_parser_1.default.parse(x);
        const contents = (Array.isArray((_a = parsedX === null || parsedX === void 0 ? void 0 : parsedX.ListBucketResult) === null || _a === void 0 ? void 0 : _a.Contents)
            ? (_b = parsedX === null || parsedX === void 0 ? void 0 : parsedX.ListBucketResult) === null || _b === void 0 ? void 0 : _b.Contents
            : [(_c = parsedX === null || parsedX === void 0 ? void 0 : parsedX.ListBucketResult) === null || _c === void 0 ? void 0 : _c.Contents]);
        output = contents.map((xmlNode) => ({
            key: xmlNode.Key,
            etag: xmlNode.ETag,
        }));
    }
    return output;
};
exports.listObjects = listObjects;
// Returns semver version
const getLatestReleaseVersion = async (params, numRetry = 0) => {
    const { project, bucket, profile, creds } = params;
    return (0, exports.getReleaseObject)({
        bucket,
        key: `latest/${project}-version.txt`,
        profile,
        creds,
    })
        .then((contents) => {
        const version = contents.toString().trim();
        if (semver.valid(version)) {
            return version;
        }
        else {
            throw new Error("Invalid version");
        }
    })
        .catch(async (err) => {
        if (numRetry < 3) {
            await (0, wait_1.wait)(1000 * (numRetry + 1));
            return (0, exports.getLatestReleaseVersion)(params, numRetry + 1);
        }
        else {
            throw err;
        }
    });
};
exports.getLatestReleaseVersion = getLatestReleaseVersion;
// tagPrefix like "apienterprise" and currentVersionNumber like "0.0.0"
// returns a list like ["0.0.2", "0.0.1"] with newer first (DESC)
const listVersionsGTE = async (params) => {
    const credentials = (0, exports.getCredentials)(params);
    const fullPrefix = `${params.tagPrefix}/release_notes/`;
    const releaseNotesFiles = await (0, exports.listObjects)({
        credentials,
        bucket: params.bucket,
        prefix: fullPrefix,
    });
    const onlyNewerOrSameVersions = releaseNotesFiles
        .map((o) => o.key)
        .map((key) => key.replace(fullPrefix, "").replace(".md", ""))
        .filter(Boolean)
        .filter((version) => semver.valid(version))
        .filter((version) => semver.gte(version, params.currentVersionNumber));
    const descendingVersions = semver.rsort(onlyNewerOrSameVersions);
    return descendingVersions;
};
exports.listVersionsGTE = listVersionsGTE;
const listVersionsGT = async (params) => (0, exports.listVersionsGTE)(params).then((versions) => versions.filter((v) => v != params.currentVersionNumber));
exports.listVersionsGT = listVersionsGT;
const readReleaseNotesFromS3 = async (params) => {
    const { project, bucket, version, profile, creds } = params;
    const buffer = await (0, exports.getReleaseObject)({
        bucket,
        key: `${project}/release_notes/${version}.md`,
        profile,
        creds,
    });
    return buffer.toString();
};
exports.readReleaseNotesFromS3 = readReleaseNotesFromS3;
const getReleaseAsset = async (params) => {
    const { profile, creds, bucket, progress } = params;
    const [project, version] = params.releaseTag.split("-v");
    const key = `${project}/release_artifacts/${version}/${params.assetName}`;
    // console.log("getReleaseAsset:", { bucket, key });
    return (0, exports.getReleaseObject)({ bucket, key, profile, creds, progress });
};
exports.getReleaseAsset = getReleaseAsset;
//# sourceMappingURL=artifact-helpers.js.map
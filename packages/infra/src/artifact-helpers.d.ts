/// <reference types="node" />
/// <reference types="node" />
import { Infra } from "@envkey/core/types";
import { Credentials, SharedIniFileCredentials } from "aws-sdk";
export declare const getCredentials: (params: {
    profile?: string;
    creds?: {
        accessKeyId: string;
        secretAccessKey: string;
    };
}) => Credentials | SharedIniFileCredentials | undefined;
export declare const getReleaseObject: (params: {
    bucket: string;
    key: string;
    profile?: string;
    creds?: {
        accessKeyId: string;
        secretAccessKey: string;
    };
    progress?: (downloadedBytes: number, totalBytes: number) => void;
}) => Promise<Buffer>;
export declare const listObjects: (params: {
    credentials: Credentials | SharedIniFileCredentials | undefined;
    bucket: string;
    prefix: string;
}) => Promise<{
    key: string;
    etag: string;
}[]>;
export declare const getLatestReleaseVersion: (params: {
    project: Infra.ProjectType;
    bucket: string;
    profile?: string;
    creds?: {
        accessKeyId: string;
        secretAccessKey: string;
    };
}, numRetry?: number) => Promise<string>;
export declare const listVersionsGTE: (params: {
    tagPrefix: string;
    currentVersionNumber: string;
    bucket: string;
    profile?: string;
    creds?: {
        accessKeyId: string;
        secretAccessKey: string;
    };
}) => Promise<string[]>;
export declare const listVersionsGT: (params: {
    tagPrefix: string;
    currentVersionNumber: string;
    bucket: string;
    profile?: string;
    creds?: {
        accessKeyId: string;
        secretAccessKey: string;
    };
}) => Promise<string[]>;
export declare const readReleaseNotesFromS3: (params: {
    project: Infra.ProjectType;
    version: string;
    bucket: string;
    profile?: string;
    creds?: {
        accessKeyId: string;
        secretAccessKey: string;
    };
}) => Promise<string>;
export declare const getReleaseAsset: (params: {
    releaseTag: string;
    assetName: string;
    bucket: string;
    profile?: string;
    creds?: {
        accessKeyId: string;
        secretAccessKey: string;
    };
    progress?: (downloadedBytes: number, totalBytes: number) => void;
}) => Promise<Buffer>;
//# sourceMappingURL=artifact-helpers.d.ts.map
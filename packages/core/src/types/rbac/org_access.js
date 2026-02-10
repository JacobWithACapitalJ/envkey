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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgAccessUpdatedSchema = exports.OrgAccessSetSchema = exports.EnvironmentPermissionFlagSchema = exports.AppPermissionFlagSchema = exports.OrgPermissionFlagSchema = exports.PermissionFlagSchema = void 0;
const _1 = require(".");
const z = __importStar(require("zod"));
const utils_1 = require("../utils");
const GeneratedEnvkeyIdSchema = z.string();
const PermissionFlagSchema = (permissions) => (0, utils_1.ZodLiteralRecord)(permissions, z.literal(true));
exports.PermissionFlagSchema = PermissionFlagSchema, exports.OrgPermissionFlagSchema = (0, exports.PermissionFlagSchema)(Object.keys(_1.orgPermissions)), exports.AppPermissionFlagSchema = (0, exports.PermissionFlagSchema)(Object.keys(_1.appPermissions)), exports.EnvironmentPermissionFlagSchema = (0, exports.PermissionFlagSchema)(Object.keys(_1.environmentPermissions));
exports.OrgAccessSetSchema = z.object({
    org: z
        .object({
        users: z.record(exports.OrgPermissionFlagSchema).optional(),
        devices: z.record(exports.OrgPermissionFlagSchema).optional(),
    })
        .optional(),
    apps: z
        .record(z.object({
        users: z.record(exports.AppPermissionFlagSchema).optional(),
        devices: z.record(exports.AppPermissionFlagSchema).optional(),
    }))
        .optional(),
    environments: z
        .record(z.object({
        servers: z.record(GeneratedEnvkeyIdSchema).optional(),
        localKeys: z.record(GeneratedEnvkeyIdSchema).optional(),
        users: z.record(exports.EnvironmentPermissionFlagSchema).optional(),
        devices: z.record(exports.EnvironmentPermissionFlagSchema).optional(),
    }))
        .optional(),
});
exports.OrgAccessUpdatedSchema = z.object({
    granted: exports.OrgAccessSetSchema.optional(),
    removed: exports.OrgAccessSetSchema.optional(),
});
//# sourceMappingURL=org_access.js.map
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
exports.Logs = void 0;
const Rbac = __importStar(require("../rbac"));
const action_type_1 = __importDefault(require("../api/action_type"));
const blob_1 = require("../blob");
const timestamps_1 = require("../timestamps");
const z = __importStar(require("zod"));
const utils = __importStar(require("../utils"));
var Logs;
(function (Logs) {
    Logs.TOTAL_COUNT_LIMIT = 10000;
    Logs.hostLoggableTypesSchema = z.enum(["hostAction"]), Logs.orgLoggableTypesSchema = z.enum([
        "authAction",
        "fetchMetaAction",
        "fetchEnvsAction",
        "fetchEnvkeyAction",
        "checkEnvkeyAction",
        "fetchLogsAction",
        "orgAction",
        "updateEnvsAction",
        "reencryptEnvsAction",
        "scimAction",
        "updateFirewallAction",
        "billingAction",
        "billingWebhookAction",
    ]), Logs.allLoggableTypesSchema = z.union([
        Logs.hostLoggableTypesSchema,
        Logs.orgLoggableTypesSchema,
    ]);
    Logs.LoggedHostActionPropsSchema = z.object({
        loggableType: z.literal("hostAction"),
        loggableType2: Logs.allLoggableTypesSchema.optional(),
        loggableType3: Logs.allLoggableTypesSchema.optional(),
        loggableType4: Logs.allLoggableTypesSchema.optional(),
        orgId: z.undefined(),
        actorId: z.undefined(),
        deviceId: z.undefined(),
    });
    Logs.LoggedAuthActionPropsSchema = z.object({
        loggableType: z.literal("authAction"),
        loggableType2: Logs.orgLoggableTypesSchema.optional(),
        loggableType3: Logs.orgLoggableTypesSchema.optional(),
        loggableType4: Logs.orgLoggableTypesSchema.optional(),
        actionType: z.string(),
        orgId: z.union([z.string(), z.undefined()]),
        actorId: z.string().optional(),
        deviceId: z.union([z.string(), z.undefined()]),
    });
    Logs.LoggedScimActionPropsSchema = z.object({
        loggableType: z.literal("scimAction"),
        loggableType2: Logs.orgLoggableTypesSchema.optional(),
        loggableType3: Logs.orgLoggableTypesSchema.optional(),
        loggableType4: Logs.orgLoggableTypesSchema.optional(),
        actionType: z.string(),
        orgId: z.string(),
        actorId: z.string(),
        deviceId: z.undefined(),
    });
    Logs.LoggedOrgActionPropsSchema = z.object({
        loggableType: z.literal("orgAction"),
        loggableType2: Logs.orgLoggableTypesSchema.optional(),
        loggableType3: Logs.orgLoggableTypesSchema.optional(),
        loggableType4: Logs.orgLoggableTypesSchema.optional(),
        actionType: z.string(),
        orgId: z.string(),
        actorId: z.string(),
        deviceId: z.union([z.string(), z.undefined()]),
        accessUpdated: Rbac.OrgAccessUpdatedSchema.optional(),
        blobsUpdated: blob_1.Blob.BlobSetSchema.optional(),
    });
    const LoggedFetchActionBaseSchema = z.object({
        loggableType: z.enum(["fetchMetaAction", "fetchLogsAction"]),
        loggableType2: Logs.orgLoggableTypesSchema.optional(),
        loggableType3: Logs.orgLoggableTypesSchema.optional(),
        loggableType4: Logs.orgLoggableTypesSchema.optional(),
        orgId: z.string(),
        actorId: z.string(),
        deviceId: z.union([z.string(), z.undefined()]),
        environmentReadPermissions: Rbac.EnvironmentReadPermissionsSchema.optional(),
    });
    Logs.LoggedFetchActionPropsSchema = utils.intersection(LoggedFetchActionBaseSchema, z.union([
        z.object({
            actionType: z.enum([
                action_type_1.default.GET_SESSION,
                action_type_1.default.FETCH_ENVS,
                action_type_1.default.FETCH_LOGS,
                action_type_1.default.FETCH_DELETED_GRAPH,
            ]),
        }),
        z.object({
            actionType: z.literal(action_type_1.default.LOAD_INVITE),
            inviteId: z.string(),
        }),
        z.object({
            actionType: z.literal(action_type_1.default.LOAD_DEVICE_GRANT),
            deviceGrantId: z.string(),
        }),
        z.object({
            actionType: z.literal(action_type_1.default.LOAD_RECOVERY_KEY),
            recoveryKeyId: z.string(),
        }),
    ]));
    Logs.LoggedFetchEnvkeyActionPropsSchema = z.object({
        loggableType: z.enum(["fetchEnvkeyAction", "checkEnvkeyAction"]),
        loggableType2: z.literal("authAction").optional(),
        loggableType3: z.undefined(),
        loggableType4: z.undefined(),
        actionType: z.union([
            z.literal(action_type_1.default.FETCH_ENVKEY),
            z.literal(action_type_1.default.CHECK_ENVKEY),
        ]),
        orgId: z.string(),
        actorId: z.union([z.string(), z.undefined()]),
        deviceId: z.union([z.string(), z.undefined()]),
        generatedEnvkeyId: z.string(),
        fetchServiceVersion: z.number(),
        isFailoverRequest: z.literal(true).optional(),
    });
    Logs.LoggedBillingWebhookActionPropsSchema = z.object({
        loggableType: z.literal("billingWebhookAction"),
        loggableType2: z.literal("billingAction"),
        loggableType3: z.undefined(),
        loggableType4: z.undefined(),
        actionType: z.string(),
        orgId: z.union([z.string(), z.undefined()]),
        actorId: z.undefined(),
        deviceId: z.undefined(),
    });
    Logs.LoggedActionSchema = utils.intersection(z
        .object({
        type: z.literal("loggedAction"),
        id: z.string(),
        transactionId: z.string(),
        actionType: z.string(),
        ip: z.string(),
        clientName: z.union([z.string(), z.undefined()]),
        clientVersion: z.string().optional(),
        responseBytes: z.number(),
        responseType: z.string(),
        error: z.literal(true).optional(),
        errorReason: z.string().optional(),
        errorStatus: z.number().optional(),
        failover: z.boolean().optional(),
        summary: z.string().optional(),
    })
        .merge(timestamps_1.TimestampsSchema), z.union([
        Logs.LoggedHostActionPropsSchema,
        Logs.LoggedAuthActionPropsSchema,
        Logs.LoggedScimActionPropsSchema,
        Logs.LoggedOrgActionPropsSchema,
        Logs.LoggedFetchActionPropsSchema,
        Logs.LoggedFetchEnvkeyActionPropsSchema,
        Logs.LoggedBillingWebhookActionPropsSchema,
    ]));
    Logs.HOST_LOGGABLE_TYPES = [
        "hostAction",
    ], Logs.ORG_LOGGABLE_TYPES = [
        "authAction",
        "fetchMetaAction",
        "fetchEnvsAction",
        "fetchEnvkeyAction",
        "fetchLogsAction",
        "orgAction",
        "updateEnvsAction",
        "scimAction",
        "updateFirewallAction",
        "billingAction",
    ], Logs.ALL_LOGGABLE_TYPES = [...Logs.HOST_LOGGABLE_TYPES, ...Logs.ORG_LOGGABLE_TYPES];
    Logs.FetchLogParamsSchema = utils.intersection(z.union([
        z.object({
            scope: z.literal("host"),
            orgIds: z.array(z.string()),
            loggableTypes: z.undefined(),
        }),
        z.object({
            scope: z.literal("org"),
            loggableTypes: z.array(Logs.orgLoggableTypesSchema),
            orgIds: z.undefined(),
        }),
    ]), z.object({
        sortDesc: z.literal(true).optional(),
        startsAt: z.number().optional(),
        endsAt: z.number().optional(),
        pageSize: z.number().optional(),
        pageNum: z.number(),
        ips: z.array(z.string()).optional(),
        clientNames: z.array(z.string()).optional(),
        actionTypes: z.array(z.string()).optional(),
        targetIds: z.array(z.string()).optional(),
        error: z.literal(true).optional(),
        userIds: z.array(z.string()).optional(),
        deviceIds: z.array(z.string()).optional(),
    }));
})(Logs || (exports.Logs = Logs = {}));
//# sourceMappingURL=index.js.map
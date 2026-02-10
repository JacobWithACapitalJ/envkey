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
exports.AppRoleEnvironmentRoleSchema = exports.EnvironmentRoleSchema = exports.EnvironmentRoleBaseSchema = exports.EnvironmentRoleSettingsSchema = exports.AppRoleSchema = exports.AppRoleBaseSchema = exports.OrgRoleSchema = exports.OrgRoleBaseSchema = exports.OrgRoleOptionalCanInviteSchema = exports.OrgRoleCanInviteSchema = exports.OrgRoleOptionalCanManageSchema = exports.OrgRoleCanManageSchema = exports.WithOptionalPermissions = exports.WithPermissions = exports.DefaultableRoleWithPermissions = exports.DefaultableRoleSchema = exports.RoleDefaultPropsSchema = exports.RoleBaseSchema = void 0;
const z = __importStar(require("zod"));
const utils = __importStar(require("../utils"));
const _1 = require(".");
const DefaultableRoleWithPermissions = (permissionsSchema) => utils.intersection(exports.DefaultableRoleSchema, z.union([
    z.object({
        isDefault: z.literal(true),
        defaultName: z.string(),
        permissions: z.undefined(),
        extendsRoleId: z.undefined(),
        addPermissions: z.undefined(),
        removePermissions: z.undefined(),
    }),
    utils.intersection(z.object({
        isDefault: z.literal(false),
        defaultName: z.undefined(),
    }), (0, exports.WithPermissions)(permissionsSchema)),
])), WithPermissions = (permissionsSchema) => z.union([
    z.object({
        permissions: z.array(permissionsSchema),
        extendsRoleId: z.undefined(),
        addPermissions: z.undefined(),
        removePermissions: z.undefined(),
    }),
    z.object({
        extendsRoleId: z.string(),
        addPermissions: z.array(permissionsSchema),
        removePermissions: z.array(permissionsSchema),
        permissions: z.undefined(),
    }),
]), WithOptionalPermissions = (permissionsSchema) => z.union([
    z
        .object({
        permissions: z.array(permissionsSchema).optional(),
        extendsRoleId: z.undefined(),
        addPermissions: z.undefined(),
        removePermissions: z.undefined(),
    })
        .partial(),
    z
        .object({
        extendsRoleId: z.string(),
        addPermissions: z.array(permissionsSchema),
        removePermissions: z.array(permissionsSchema),
        permissions: z.undefined(),
    })
        .partial(),
]);
exports.RoleBaseSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    createdAt: z.number(),
    updatedAt: z.number(),
    deletedAt: z.number().optional(),
    orderIndex: z.number(),
}), exports.RoleDefaultPropsSchema = z.union([
    z.object({
        isDefault: z.literal(true),
        defaultName: z.string(),
        defaultDescription: z.string(),
    }),
    z.object({
        isDefault: z.literal(false),
        defaultName: z.undefined(),
        defaultDescription: z.undefined(),
    }),
]), exports.DefaultableRoleSchema = utils.intersection(exports.RoleBaseSchema, exports.RoleDefaultPropsSchema), exports.DefaultableRoleWithPermissions = DefaultableRoleWithPermissions, exports.WithPermissions = WithPermissions, exports.WithOptionalPermissions = WithOptionalPermissions, exports.OrgRoleCanManageSchema = z.union([
    z.object({
        canManageAllOrgRoles: z.literal(true),
        canManageOrgRoleIds: z.undefined(),
    }),
    z.object({
        canManageAllOrgRoles: z.undefined(),
        canManageOrgRoleIds: z.array(z.string()),
    }),
]), exports.OrgRoleOptionalCanManageSchema = z.union([
    z
        .object({
        canManageAllOrgRoles: z.literal(true),
        canManageOrgRoleIds: z.undefined(),
    })
        .partial(),
    z
        .object({
        canManageAllOrgRoles: z.undefined(),
        canManageOrgRoleIds: z.array(z.string()),
    })
        .partial(),
]), exports.OrgRoleCanInviteSchema = z.union([
    z.object({
        canInviteAllOrgRoles: z.literal(true),
        canInviteOrgRoleIds: z.undefined(),
    }),
    z.object({
        canInviteAllOrgRoles: z.undefined(),
        canInviteOrgRoleIds: z.array(z.string()),
    }),
]), exports.OrgRoleOptionalCanInviteSchema = z.union([
    z
        .object({
        canInviteAllOrgRoles: z.literal(true),
        canInviteOrgRoleIds: z.undefined(),
    })
        .partial(),
    z
        .object({
        canInviteAllOrgRoles: z.undefined(),
        canInviteOrgRoleIds: z.array(z.string()),
    })
        .partial(),
]), exports.OrgRoleBaseSchema = z.object({
    type: z.literal("orgRole"),
    autoAppRoleId: z.string().optional(),
    canHaveCliUsers: z.boolean(),
});
exports.OrgRoleSchema = utils.intersection((0, exports.DefaultableRoleWithPermissions)(_1.OrgPermissionSchema), utils.intersection(utils.intersection(exports.OrgRoleBaseSchema, exports.OrgRoleCanManageSchema), exports.OrgRoleCanInviteSchema));
exports.AppRoleBaseSchema = z.object({
    type: z.literal("appRole"),
    defaultAllApps: z.boolean(),
    canHaveCliUsers: z.boolean(),
    canManageAppRoleIds: z.array(z.string()),
    canInviteAppRoleIds: z.array(z.string()),
    hasFullEnvironmentPermissions: z.boolean(),
});
exports.AppRoleSchema = utils.intersection(exports.AppRoleBaseSchema, (0, exports.DefaultableRoleWithPermissions)(_1.AppPermissionSchema));
exports.EnvironmentRoleSettingsSchema = z.object({
    autoCommit: z.boolean(),
}), exports.EnvironmentRoleBaseSchema = z.object({
    type: z.literal("environmentRole"),
    hasLocalKeys: z.boolean(),
    hasServers: z.boolean(),
    defaultAllApps: z.boolean(),
    defaultAllBlocks: z.boolean(),
    orderIndex: z.number(),
    settings: exports.EnvironmentRoleSettingsSchema,
    importId: z.string().optional(),
});
exports.EnvironmentRoleSchema = utils.intersection(exports.EnvironmentRoleBaseSchema, exports.DefaultableRoleSchema);
exports.AppRoleEnvironmentRoleSchema = z.object({
    id: z.string(),
    type: z.literal("appRoleEnvironmentRole"),
    appRoleId: z.string(),
    permissions: z.array(_1.EnvironmentPermissionSchema),
    environmentRoleId: z.string(),
    createdAt: z.number(),
    updatedAt: z.number(),
    deletedAt: z.number().optional(),
});
//# sourceMappingURL=roles.js.map
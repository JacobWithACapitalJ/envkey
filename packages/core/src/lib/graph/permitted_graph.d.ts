import { Model, Graph } from "../../types";
export declare const getPermittedGraphObjects: (graph: Graph.Graph, userId: string, deviceId: string | undefined, includeDeleted?: boolean) => {
    pubkeyRevocationRequests: {
        type?: "pubkeyRevocationRequest";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        creatorId?: string;
        targetId?: string;
    }[];
    rootPubkeyReplacements: {
        type?: "rootPubkeyReplacement";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        creatorId?: string;
        requestId?: string;
        replacingPubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        signedReplacingTrustChain?: {
            data?: string;
        };
    }[];
    products: {
        type?: "product";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        plan?: "enterprise" | "cloud_basics" | "cloud_pro" | "business_cloud";
        maxUsers?: number;
        maxEnvkeyWatchers?: number;
        adjustableQuantity?: boolean;
        ssoEnabled?: boolean;
        teamsEnabled?: boolean;
        customRbacEnabled?: boolean;
        isCloudBasics?: boolean;
    }[];
    prices: {
        type?: "price";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        productId?: string;
        interval?: "month" | "year";
        amount?: number;
    }[];
    customer: {
        type?: "customer";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        billingEmail?: string;
    };
    subscription: {
        type?: "subscription";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        productId?: string;
        priceId?: string;
        quantity?: number;
        status?: "trialing" | "incomplete" | "incomplete_expired" | "active" | "past_due" | "canceled" | "unpaid";
        canceledAt?: number;
        currentPeriodStartsAt?: number;
        currentPeriodEndsAt?: number;
        hasPromotionCode?: boolean;
        amountOff?: number;
        percentOff?: number;
    };
    paymentSource: {
        type?: "paymentSource";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        paymentType?: "card";
        brand?: string;
        last4?: string;
        expMonth?: number;
        expYear?: number;
    };
    vantaConnectedAccount: {
        type?: "vantaConnectedAccount";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        status?: "active" | "error";
        lastSyncAt?: number;
        error?: string;
    };
    appRoleEnvironmentRoles: {
        type?: "appRoleEnvironmentRole";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        permissions?: ("write" | "write_branches" | "read" | "read_inherits" | "read_meta" | "read_history" | "read_branches" | "read_branches_inherits" | "read_branches_meta" | "read_branches_history")[];
        appRoleId?: string;
        environmentRoleId?: string;
    }[];
    externalAuthProviders: ({
        type?: "externalAuthProvider";
        orgId?: string;
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        nickname?: string;
        authMethod?: "oauth_cloud" | "oauth_hosted" | "saml";
    } & ({
        provider?: "github_hosted" | "gitlab_hosted";
    } | {
        provider?: "saml";
        samlSettingsId?: string;
    }))[];
    orgRoles: ((({
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        name?: string;
        description?: string;
    } & ({
        isDefault?: true;
        defaultName?: string;
        defaultDescription?: string;
    } | {
        isDefault?: false;
        defaultName?: undefined;
        defaultDescription?: undefined;
    })) & ({
        isDefault?: true;
        defaultName?: string;
        permissions?: undefined;
        extendsRoleId?: undefined;
        addPermissions?: undefined;
        removePermissions?: undefined;
    } | ({
        isDefault?: false;
        defaultName?: undefined;
    } & ({
        permissions?: ("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[];
        extendsRoleId?: undefined;
        addPermissions?: undefined;
        removePermissions?: undefined;
    } | {
        permissions?: undefined;
        extendsRoleId?: string;
        addPermissions?: ("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[];
        removePermissions?: ("org_rename" | "org_manage_settings" | "org_manage_auth_settings" | "org_manage_billing" | "org_manage_users" | "org_manage_user_devices" | "org_invite_users_to_permitted_apps" | "org_approve_devices_for_permitted" | "org_manage_cli_users" | "org_create_cli_users_for_permitted_apps" | "org_manage_app_roles" | "org_manage_org_roles" | "org_manage_environment_roles" | "org_manage_teams" | "org_manage_app_groups" | "org_manage_block_groups" | "org_read_logs" | "org_manage_firewall" | "org_generate_recovery_key" | "org_clear_tokens" | "org_archive_import_export" | "org_manage_integrations" | "org_delete" | "apps_create" | "apps_delete" | "apps_read_permitted" | "blocks_create" | "blocks_read_all" | "blocks_rename" | "blocks_manage_settings" | "blocks_write_envs_all" | "blocks_write_envs_permitted" | "blocks_manage_connections_permitted" | "blocks_manage_environments" | "blocks_delete" | "self_hosted_upgrade" | "self_hosted_manage_host" | "self_hosted_read_host_logs")[];
    })))) & (({
        type?: "orgRole";
        autoAppRoleId?: string;
        canHaveCliUsers?: boolean;
    } & ({
        canManageAllOrgRoles?: true;
        canManageOrgRoleIds?: undefined;
    } | {
        canManageAllOrgRoles?: undefined;
        canManageOrgRoleIds?: string[];
    })) & ({
        canInviteAllOrgRoles?: true;
        canInviteOrgRoleIds?: undefined;
    } | {
        canInviteAllOrgRoles?: undefined;
        canInviteOrgRoleIds?: string[];
    })))[];
    appRoles: ({
        type?: "appRole";
        canHaveCliUsers?: boolean;
        defaultAllApps?: boolean;
        canManageAppRoleIds?: string[];
        canInviteAppRoleIds?: string[];
        hasFullEnvironmentPermissions?: boolean;
    } & (({
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        name?: string;
        description?: string;
    } & ({
        isDefault?: true;
        defaultName?: string;
        defaultDescription?: string;
    } | {
        isDefault?: false;
        defaultName?: undefined;
        defaultDescription?: undefined;
    })) & ({
        isDefault?: true;
        defaultName?: string;
        permissions?: undefined;
        extendsRoleId?: undefined;
        addPermissions?: undefined;
        removePermissions?: undefined;
    } | ({
        isDefault?: false;
        defaultName?: undefined;
    } & ({
        permissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
        extendsRoleId?: undefined;
        addPermissions?: undefined;
        removePermissions?: undefined;
    } | {
        permissions?: undefined;
        extendsRoleId?: string;
        addPermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
        removePermissions?: ("app_read" | "app_rename" | "app_manage_settings" | "app_manage_users" | "app_approve_user_devices" | "app_manage_cli_users" | "app_read_own_locals" | "app_read_user_locals" | "app_read_user_locals_history" | "app_write_user_locals" | "app_manage_blocks" | "app_manage_environments" | "app_manage_servers" | "app_manage_local_keys" | "app_read_logs" | "app_manage_included_roles" | "app_manage_firewall")[];
    })))))[];
    environmentRoles: ({
        type?: "environmentRole";
        importId?: string;
        orderIndex?: number;
        settings?: {
            autoCommit?: boolean;
        };
        defaultAllApps?: boolean;
        hasLocalKeys?: boolean;
        hasServers?: boolean;
        defaultAllBlocks?: boolean;
    } & ({
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        name?: string;
        description?: string;
    } & ({
        isDefault?: true;
        defaultName?: string;
        defaultDescription?: string;
    } | {
        isDefault?: false;
        defaultName?: undefined;
        defaultDescription?: undefined;
    })))[];
    scimProvisioningProviders: {
        type?: "scimProvisioningProvider";
        orgId?: string;
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        nickname?: string;
        authScheme?: "bearer";
        endpointBaseUrl?: string;
    }[];
    org: Model.Org;
    apps: {
        type?: "app";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        settings?: {
            autoCommitLocals?: boolean;
            autoCaps?: boolean;
        };
        environmentRoleIpsAllowed?: Record<string, string[]>;
        environmentRoleIpsMergeStrategies?: Record<string, "extend" | "override">;
        envsUpdatedAt?: number;
        localsUpdatedAtByUserId?: Record<string, number>;
        localsUpdatedAt?: number;
        localsEncryptedBy?: Record<string, string>;
        localsReencryptionRequiredAt?: Record<string, number>;
        envsOrLocalsUpdatedAt?: number;
        localsRequireReinit?: boolean;
    }[];
    blocks: {
        type?: "block";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        settings?: {
            autoCommitLocals?: boolean;
            autoCaps?: boolean;
        };
        envsUpdatedAt?: number;
        localsUpdatedAtByUserId?: Record<string, number>;
        localsUpdatedAt?: number;
        localsEncryptedBy?: Record<string, string>;
        localsReencryptionRequiredAt?: Record<string, number>;
        envsOrLocalsUpdatedAt?: number;
        localsRequireReinit?: boolean;
    }[];
    orgUsers: {
        type?: "orgUser";
        email?: string;
        id?: string;
        uid?: string;
        provider?: "email" | "saml" | "github" | "gitlab" | "google" | "github_hosted" | "gitlab_hosted";
        externalAuthProviderId?: string;
        firstName?: string;
        lastName?: string;
        invitedById?: string;
        isCreator?: boolean;
        inviteAcceptedAt?: number;
        orgRoleId?: string;
        deactivatedAt?: number;
        orgRoleUpdatedAt?: number;
        scim?: {
            providerId?: string;
            candidateId?: string;
        };
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
    }[];
    orgUserDevices: ({
        type?: "orgUserDevice";
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        userId?: string;
        id?: string;
        deactivatedAt?: number;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        isRoot?: true;
        revokedRootAt?: number;
        approvedAt?: number;
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
    } & ({
        approvedByType?: "creator";
    } | {
        approvedByType?: "invite";
        inviteId?: string;
    } | {
        approvedByType?: "deviceGrant";
        deviceGrantId?: string;
    } | {
        approvedByType?: "recoveryKey";
        recoveryKeyId?: string;
    }))[];
    cliUsers: {
        type?: "cliUser";
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        id?: string;
        orgRoleId?: string;
        deactivatedAt?: number;
        orgRoleUpdatedAt?: number;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        creatorId?: string;
        isRoot?: true;
        revokedRootAt?: number;
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
        signedById?: string;
        creatorDeviceId?: string;
    }[];
    deviceGrants: {
        type?: "deviceGrant";
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        deviceId?: string;
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        expiresAt?: number;
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
        signedById?: string;
        acceptedAt?: number;
        granteeId?: string;
        grantedByUserId?: string;
        grantedByDeviceId?: string;
    }[];
    invites: {
        type?: "invite";
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        expiresAt?: number;
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
        inviteeId?: string;
        invitedByUserId?: string;
        invitedByDeviceId?: string;
        signedById?: string;
        acceptedAt?: number;
        v1Invite?: boolean;
    }[];
    recoveryKeys: {
        type?: "recoveryKey";
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        userId?: string;
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
        signedById?: string;
        creatorDeviceId?: string;
        redeemedAt?: number;
    }[];
    appUserGrants: {
        type?: "appUserGrant";
        userId?: string;
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        appId?: string;
        appRoleId?: string;
    }[];
    appBlocks: {
        type?: "appBlock";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        appId?: string;
        blockId?: string;
    }[];
    groupMemberships: {
        type?: "groupMembership";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        groupId?: string;
        objectId?: string;
    }[];
    groups: {
        type?: "group";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        objectType?: "orgUser" | "app" | "block";
        membershipsUpdatedAt?: number;
    }[];
    appUserGroups: {
        type?: "appUserGroup";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        appId?: string;
        appRoleId?: string;
        userGroupId?: string;
    }[];
    appGroupUserGroups: {
        type?: "appGroupUserGroup";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        appRoleId?: string;
        userGroupId?: string;
        appGroupId?: string;
    }[];
    appGroupUsers: {
        type?: "appGroupUser";
        userId?: string;
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        appRoleId?: string;
        appGroupId?: string;
    }[];
    appGroupBlocks: {
        type?: "appGroupBlock";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        blockId?: string;
        appGroupId?: string;
    }[];
    appBlockGroups: {
        type?: "appBlockGroup";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        appId?: string;
        blockGroupId?: string;
    }[];
    appGroupBlockGroups: {
        type?: "appGroupBlockGroup";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        orderIndex?: number;
        appGroupId?: string;
        blockGroupId?: string;
    }[];
    servers: {
        type?: "server";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        appId?: string;
        environmentId?: string;
    }[];
    localKeys: {
        type?: "localKey";
        userId?: string;
        deviceId?: string;
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        appId?: string;
        environmentId?: string;
        autoGenerated?: true;
        isV1UpgradeKey?: true;
    }[];
    includedAppRoles: {
        type?: "includedAppRole";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        appId?: string;
        appRoleId?: string;
    }[];
    environments: ({
        type?: "environment";
        id?: string;
        importId?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        "upgradedCrypto-2.1.0"?: boolean;
        environmentRoleId?: string;
        envParentId?: string;
        envUpdatedAt?: number;
        encryptedById?: string;
        reencryptionRequiredAt?: number;
        requiresReinit?: boolean;
    } & ({
        settings?: {
            autoCommit?: boolean;
        };
        isSub?: false;
    } | {
        isSub?: true;
        parentEnvironmentId?: string;
        subName?: string;
    }))[];
    variableGroups: {
        type?: "variableGroup";
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        name?: string;
        envParentId?: string;
        subEnvironmentId?: string;
    }[];
    generatedEnvkeys: {
        type?: "generatedEnvkey";
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        id?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number;
        creatorId?: string;
        pubkeyId?: string;
        pubkeyUpdatedAt?: number;
        signedById?: string;
        creatorDeviceId?: string;
        appId?: string;
        environmentId?: string;
        keyableParentId?: string;
        keyableParentType?: "server" | "localKey";
        envkeyShort?: string;
        envkeyIdPartHash?: string;
        blobsUpdatedAt?: number;
    }[];
};
//# sourceMappingURL=permitted_graph.d.ts.map
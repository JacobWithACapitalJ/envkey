"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultOrgSettings = void 0;
const getDefaultOrgSettings = () => ({
    auth: {
        inviteExpirationMs: 1000 * 60 * 60 * 24,
        deviceGrantExpirationMs: 1000 * 60 * 60 * 24,
        tokenExpirationMs: 1000 * 60 * 60 * 24 * 7 * 4,
    },
    crypto: {
        requiresPassphrase: false,
        requiresLockout: false,
        lockoutMs: undefined,
    },
    envs: {
        autoCaps: true,
        autoCommitLocals: false,
    },
});
exports.getDefaultOrgSettings = getDefaultOrgSettings;
//# sourceMappingURL=defaults.js.map
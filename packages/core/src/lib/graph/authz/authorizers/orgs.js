"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canDeleteOrg = exports.canRenameOrg = exports.canUpdateOrgSettings = void 0;
const helpers_1 = require("./helpers");
const canUpdateOrgSettings = (graph, currentUserId) => (0, helpers_1.hasAllOrgPermissions)(graph, currentUserId, ["org_manage_settings"]), canRenameOrg = (graph, currentUserId) => (0, helpers_1.hasAllOrgPermissions)(graph, currentUserId, ["org_rename"]), canDeleteOrg = (graph, currentUserId) => (0, helpers_1.hasAllOrgPermissions)(graph, currentUserId, ["org_delete"]);
exports.canUpdateOrgSettings = canUpdateOrgSettings, exports.canRenameOrg = canRenameOrg, exports.canDeleteOrg = canDeleteOrg;
//# sourceMappingURL=orgs.js.map
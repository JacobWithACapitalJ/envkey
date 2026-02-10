"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSubdomain = exports.generateDeploymentTag = void 0;
const utils_1 = require("../crypto/utils");
const generateDeploymentTag = () => (0, utils_1.secureRandomAlphanumeric)(10).toLowerCase();
exports.generateDeploymentTag = generateDeploymentTag;
const generateSubdomain = () => (0, utils_1.secureRandomAlphanumeric)(6).toLowerCase();
exports.generateSubdomain = generateSubdomain;
//# sourceMappingURL=index.js.map
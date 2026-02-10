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
exports.V1Upgrade = void 0;
const z = __importStar(require("zod"));
var V1Upgrade;
(function (V1Upgrade) {
    V1Upgrade.UpgradeSchema = z.object({
        ts: z.number(),
        signature: z.string(),
        stripeCustomerId: z.string(),
        stripeSubscriptionId: z.string(),
        numUsers: z.number(),
        ssoEnabled: z.boolean().optional(),
        billingInterval: z.enum(["month", "year"]).optional(),
        newProductId: z.string().optional(),
        freeTier: z.boolean().optional(),
        signedPresetBilling: z.string().optional(),
    });
    V1Upgrade.PresetBillingSchema = z.object({
        stripeProductId: z.string(),
        billingInterval: z.enum(["month", "year"]),
        trialPeriodDays: z.number(),
    });
})(V1Upgrade || (exports.V1Upgrade = V1Upgrade = {}));
//# sourceMappingURL=v1_upgrade.js.map
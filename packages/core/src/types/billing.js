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
exports.BillingSettingsSchema = exports.PaymentSourceSchema = exports.InvoiceSchema = exports.SubscriptionSchema = exports.CustomerSchema = exports.PriceSchema = exports.ProductSchema = exports.PlanTypeSchema = void 0;
const z = __importStar(require("zod"));
const timestamps_1 = require("./timestamps");
exports.PlanTypeSchema = z.enum([
    "cloud_basics",
    "cloud_pro",
    "business_cloud",
    "enterprise",
]);
exports.ProductSchema = z
    .object({
    type: z.literal("product"),
    id: z.string(),
    plan: exports.PlanTypeSchema,
    name: z.string(),
    maxUsers: z.number(),
    maxEnvkeyWatchers: z.number(),
    adjustableQuantity: z.boolean().optional(),
    ssoEnabled: z.boolean().optional(),
    teamsEnabled: z.boolean().optional(),
    customRbacEnabled: z.boolean().optional(),
    isCloudBasics: z.boolean(),
})
    .merge(timestamps_1.TimestampsSchema);
exports.PriceSchema = z
    .object({
    type: z.literal("price"),
    id: z.string(),
    name: z.string(),
    productId: z.string(),
    interval: z.enum(["month", "year"]),
    amount: z.number(),
})
    .merge(timestamps_1.TimestampsSchema);
exports.CustomerSchema = z
    .object({
    type: z.literal("customer"),
    id: z.string(),
    billingEmail: z.string(),
})
    .merge(timestamps_1.TimestampsSchema);
exports.SubscriptionSchema = z
    .object({
    type: z.literal("subscription"),
    id: z.string(),
    productId: z.string(),
    priceId: z.string(),
    quantity: z.number(),
    status: z.enum([
        "trialing",
        "incomplete",
        "incomplete_expired",
        "active",
        "past_due",
        "canceled",
        "unpaid",
    ]),
    canceledAt: z.number().optional(),
    currentPeriodStartsAt: z.number().optional(),
    currentPeriodEndsAt: z.number().optional(),
    hasPromotionCode: z.boolean().optional(),
    amountOff: z.number().optional(),
    percentOff: z.number().optional(),
})
    .merge(timestamps_1.TimestampsSchema);
exports.InvoiceSchema = z
    .object({
    type: z.literal("invoice"),
    id: z.string(),
    productId: z.string(),
    productName: z.string(),
    priceId: z.string(),
    subscriptionId: z.string().optional(),
    stripeId: z.string(),
    stripeChargeId: z.string().optional(),
    amountDue: z.number(),
    numActiveUsers: z.number(),
    maxUsers: z.number(),
    attemptCount: z.number(),
    attempted: z.boolean(),
    status: z
        .enum(["deleted", "draft", "open", "paid", "uncollectible", "void"])
        .optional(),
    nextPaymentAttempt: z.number().optional(),
    paid: z.boolean(),
    periodStart: z.number(),
    periodEnd: z.number(),
    periodString: z.string(),
    refNumber: z.string().optional(),
    subtotal: z.number(),
    total: z.number(),
    tax: z.number().optional(),
    amountRefunded: z.number().optional(),
    html: z.string().optional(),
})
    .merge(timestamps_1.TimestampsSchema);
exports.PaymentSourceSchema = z
    .object({
    type: z.literal("paymentSource"),
    id: z.string(),
    paymentType: z.literal("card"),
    brand: z.string().optional(),
    last4: z.string().optional(),
    expMonth: z.number().optional(),
    expYear: z.number().optional(),
})
    .merge(timestamps_1.TimestampsSchema);
exports.BillingSettingsSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    vat: z.string().optional(),
});
//# sourceMappingURL=billing.js.map
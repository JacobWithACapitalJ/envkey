import * as z from "zod";
export type License = {
    type: "license";
    id: string;
    orgBillingId: string;
    env: "development" | "production";
    plan: "free" | "paid";
    isCloudEssentials?: boolean;
    isCloudBasics?: boolean;
    hostType: "cloud" | "enterprise" | "community";
    expiresAt: number;
    maxUsers?: number;
    maxDevices: number;
    maxServerEnvkeys: number;
    maxCloudStorageMb?: number;
    maxCloudApiCallsPerHour?: number;
    maxCloudApiCallsPerMonth?: number;
    maxCloudDataTransferPerHourMb?: number;
    maxCloudDataTransferPerDayMb?: number;
    maxCloudDataTransferPerMonthMb?: number;
    maxCloudActiveSocketConnections?: number;
    cloudLogRetentionDays?: number;
    provisional?: boolean;
    createdAt: number;
    deletedAt?: number;
};
export declare const PlanTypeSchema: z.ZodEnum<["cloud_basics", "cloud_pro", "business_cloud", "enterprise"]>;
export type PlanType = z.infer<typeof PlanTypeSchema>;
export declare const ProductSchema: z.ZodObject<{
    type: z.ZodLiteral<"product">;
    id: z.ZodString;
    plan: z.ZodEnum<["cloud_basics", "cloud_pro", "business_cloud", "enterprise"]>;
    name: z.ZodString;
    maxUsers: z.ZodNumber;
    maxEnvkeyWatchers: z.ZodNumber;
    adjustableQuantity: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
    ssoEnabled: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
    teamsEnabled: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
    customRbacEnabled: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
    isCloudBasics: z.ZodBoolean;
} & {
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
}, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
    strict: true;
}, {
    strict: true;
}>, {
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
}>;
export type Product = z.infer<typeof ProductSchema>;
export declare const PriceSchema: z.ZodObject<{
    type: z.ZodLiteral<"price">;
    id: z.ZodString;
    name: z.ZodString;
    productId: z.ZodString;
    interval: z.ZodEnum<["month", "year"]>;
    amount: z.ZodNumber;
} & {
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
}, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
    strict: true;
}, {
    strict: true;
}>, {
    type?: "price";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    name?: string;
    productId?: string;
    interval?: "month" | "year";
    amount?: number;
}>;
export type Price = z.infer<typeof PriceSchema>;
export declare const CustomerSchema: z.ZodObject<{
    type: z.ZodLiteral<"customer">;
    id: z.ZodString;
    billingEmail: z.ZodString;
} & {
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
}, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
    strict: true;
}, {
    strict: true;
}>, {
    type?: "customer";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    billingEmail?: string;
}>;
export type Customer = z.infer<typeof CustomerSchema>;
export declare const SubscriptionSchema: z.ZodObject<{
    type: z.ZodLiteral<"subscription">;
    id: z.ZodString;
    productId: z.ZodString;
    priceId: z.ZodString;
    quantity: z.ZodNumber;
    status: z.ZodEnum<["trialing", "incomplete", "incomplete_expired", "active", "past_due", "canceled", "unpaid"]>;
    canceledAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    currentPeriodStartsAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    currentPeriodEndsAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    hasPromotionCode: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
    amountOff: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    percentOff: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
} & {
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
}, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
    strict: true;
}, {
    strict: true;
}>, {
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
}>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
export declare const InvoiceSchema: z.ZodObject<{
    type: z.ZodLiteral<"invoice">;
    id: z.ZodString;
    productId: z.ZodString;
    productName: z.ZodString;
    priceId: z.ZodString;
    subscriptionId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    stripeId: z.ZodString;
    stripeChargeId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    amountDue: z.ZodNumber;
    numActiveUsers: z.ZodNumber;
    maxUsers: z.ZodNumber;
    attemptCount: z.ZodNumber;
    attempted: z.ZodBoolean;
    status: z.ZodUnion<[z.ZodEnum<["deleted", "draft", "open", "paid", "uncollectible", "void"]>, z.ZodUndefined]>;
    nextPaymentAttempt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    paid: z.ZodBoolean;
    periodStart: z.ZodNumber;
    periodEnd: z.ZodNumber;
    periodString: z.ZodString;
    refNumber: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    subtotal: z.ZodNumber;
    total: z.ZodNumber;
    tax: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    amountRefunded: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    html: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
} & {
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
}, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
    strict: true;
}, {
    strict: true;
}>, {
    type?: "invoice";
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    paid?: boolean;
    maxUsers?: number;
    productId?: string;
    priceId?: string;
    status?: "void" | "paid" | "deleted" | "draft" | "open" | "uncollectible";
    productName?: string;
    subscriptionId?: string;
    stripeId?: string;
    stripeChargeId?: string;
    amountDue?: number;
    numActiveUsers?: number;
    attemptCount?: number;
    attempted?: boolean;
    nextPaymentAttempt?: number;
    periodStart?: number;
    periodEnd?: number;
    periodString?: string;
    refNumber?: string;
    subtotal?: number;
    total?: number;
    tax?: number;
    amountRefunded?: number;
    html?: string;
}>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export declare const PaymentSourceSchema: z.ZodObject<{
    type: z.ZodLiteral<"paymentSource">;
    id: z.ZodString;
    paymentType: z.ZodLiteral<"card">;
    brand: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    last4: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    expMonth: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
    expYear: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
} & {
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
}, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
    strict: true;
}, {
    strict: true;
}>, {
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
}>;
export type PaymentSource = z.infer<typeof PaymentSourceSchema>;
export declare const BillingSettingsSchema: z.ZodObject<{
    name: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    email: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    address: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    vat: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
}, {
    strict: true;
}, {
    email?: string;
    name?: string;
    address?: string;
    vat?: string;
}>;
export type BillingSettings = z.infer<typeof BillingSettingsSchema>;
//# sourceMappingURL=billing.d.ts.map
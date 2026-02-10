import * as z from "zod";
export declare namespace V1Upgrade {
    const UpgradeSchema: z.ZodObject<{
        ts: z.ZodNumber;
        signature: z.ZodString;
        stripeCustomerId: z.ZodString;
        stripeSubscriptionId: z.ZodString;
        numUsers: z.ZodNumber;
        ssoEnabled: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        billingInterval: z.ZodUnion<[z.ZodEnum<["month", "year"]>, z.ZodUndefined]>;
        newProductId: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        freeTier: z.ZodUnion<[z.ZodBoolean, z.ZodUndefined]>;
        signedPresetBilling: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    }, {
        strict: true;
    }, {
        signature?: string;
        ssoEnabled?: boolean;
        ts?: number;
        stripeCustomerId?: string;
        stripeSubscriptionId?: string;
        numUsers?: number;
        billingInterval?: "month" | "year";
        newProductId?: string;
        freeTier?: boolean;
        signedPresetBilling?: string;
    }>;
    const PresetBillingSchema: z.ZodObject<{
        stripeProductId: z.ZodString;
        billingInterval: z.ZodEnum<["month", "year"]>;
        trialPeriodDays: z.ZodNumber;
    }, {
        strict: true;
    }, {
        billingInterval?: "month" | "year";
        stripeProductId?: string;
        trialPeriodDays?: number;
    }>;
    type PresetBilling = z.infer<typeof PresetBillingSchema>;
    type Upgrade = z.infer<typeof UpgradeSchema>;
}
//# sourceMappingURL=v1_upgrade.d.ts.map
import * as z from "zod";
export declare const TimestampsSchema: z.ZodObject<{
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    deletedAt: z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
}, {
    strict: true;
}, {
    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;
}>;
//# sourceMappingURL=timestamps.d.ts.map
import { Client } from "../../types";
export declare const asyncify: <T extends (...args: any[]) => any>(name: string, fn: T) => (...params: Parameters<T>) => Promise<ReturnType<T>>;
export declare const clearOrphanedBlobPaths: (state: Client.State, currentUserId: string, currentDeviceId: string) => Promise<any>;
//# sourceMappingURL=index.d.ts.map
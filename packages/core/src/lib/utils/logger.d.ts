export type Logger = (msg: string, data?: object) => void;
export declare const log: Logger;
export declare const logStderr: Logger;
export declare const logDevOnly: Logger;
export declare const initFileLogger: (name: string) => void;
export declare const logWithElapsed: (lbl: string, now: number, obj?: {}) => void;
export declare const getCircularReplacer: () => (key: any, value: any) => any;
//# sourceMappingURL=logger.d.ts.map
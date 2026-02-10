export declare function pick<T, K extends keyof T = keyof T>(keys: K[]): (obj: T) => Pick<T, K>;
export declare function pick<T, K extends keyof T = keyof T>(keys: K[], obj: T): Pick<T, K>;
export declare function pickDefined<T, K extends keyof T = keyof T>(keys: K[]): (obj: T) => Pick<T, K>;
export declare function pickDefined<T, K extends keyof T = keyof T>(keys: K[], obj: T): Pick<T, K>;
//# sourceMappingURL=pick.d.ts.map
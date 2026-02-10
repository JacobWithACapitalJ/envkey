export * from "./pick";
export * from "./prop";
export declare const flattenObj: (obj: object) => {
    [k: string]: any;
}, transformKeysDeep: (obj: {
    [k: string]: any;
}, keys: string[], transformer: (v: any) => any) => {
    [k: string]: any;
}, allKeysDeep: (obj: {
    [k: string]: any;
}) => string[], stripUndefinedRecursive: <T = any>(obj: T) => T, stripNullsRecursive: <T = any>(obj: T) => T, stripEmptyRecursive: <T = any>(obj: T) => T, objectPaths: (obj: {
    [k: string]: any;
}) => string[][], objectDifference: <T extends {
    [k: string]: any;
}>(obj1: T, obj2: T) => T, objectIntersection: <T extends {
    [k: string]: any;
}>(obj1: T, obj2: T) => T, setToObject: <T extends string>(s: Set<T>) => { [key in T]: true; };
//# sourceMappingURL=object.d.ts.map
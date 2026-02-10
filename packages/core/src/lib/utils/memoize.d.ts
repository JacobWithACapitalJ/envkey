import memoize from "memoizee";
type Memoizer = (...args: any[]) => any;
export declare const configureMemoization: (numItems: number, maxAge: number) => void;
export declare const memoizeShallowFirstDeepRest: <T extends Memoizer>(fn: T) => T & memoize.Memoized<T>;
export declare const memoizeShallowAll: <T extends Memoizer>(fn: T) => T & memoize.Memoized<T>;
export declare const memoizeDeepAll: <T extends Memoizer>(fn: T) => T & memoize.Memoized<T>;
export default memoizeShallowFirstDeepRest;
//# sourceMappingURL=memoize.d.ts.map
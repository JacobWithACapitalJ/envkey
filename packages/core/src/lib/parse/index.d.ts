export type Format = "json" | "yaml" | "env" | "json-pretty";
type Parser = (txt: string, formats?: Format[]) => {
    [k: string]: string;
} | null;
type Dumper = (obj: {
    [k: string]: string;
}, format?: Format) => string;
export declare const parseJson: Parser, parseYaml: Parser, parseDotenv: Parser, parseMultiFormat: Parser, toYaml: Dumper, toDotEnv: Dumper, rawEnvToTxt: Dumper;
export {};
//# sourceMappingURL=index.d.ts.map
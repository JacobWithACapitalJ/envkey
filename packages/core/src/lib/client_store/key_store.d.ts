import { Crypto } from "../../types";
type DeviceKey = {
    auth: string;
} & ({
    key: string;
} | {
    encryptedKey: Crypto.PassphraseEncryptedData;
} | {
    key: string;
    encryptedKey: Crypto.PassphraseEncryptedData;
});
export declare const initKeyStore: () => Promise<void>, initDeviceKey: (passphrase?: string) => Promise<({
    auth: string;
} & {
    key: string;
}) | ({
    auth: string;
} & {
    key: string;
    encryptedKey: Crypto.PassphraseEncryptedData;
})>, getDeviceKey: () => Promise<DeviceKey>, hasDeviceKey: () => Promise<boolean>, isLocked: () => boolean, unlock: (passphrase: string) => Promise<({
    auth: string;
} & {
    key: string;
}) | ({
    auth: string;
} & {
    key: string;
    encryptedKey: Crypto.PassphraseEncryptedData;
})>, lock: () => Promise<void>, getCoreProcAuthToken: () => Promise<string>, enableLogging: () => boolean;
export {};
//# sourceMappingURL=key_store.d.ts.map
import { ProcState } from "./state";
declare const defaultPersistable: Omit<ProcState, "clientStates" | "networkUnreachable" | "v1IsUpgrading" | "v1UpgradeError" | "v1UpgradeAccountId" | "v1UpgradeStatus" | "v1UpgradeAcceptedInvite" | "v1UpgradeInviteToken" | "v1UpgradeEncryptionToken" | "v1ClientAliveAt" | "cloudProducts" | "cloudPrices" | "isLoadingCloudProducts" | "loadCloudProductsError">;
export type StatePersistenceKey = keyof typeof defaultPersistable;
export type PersistedProcState = Pick<ProcState, StatePersistenceKey>;
export declare const STATE_PERSISTENCE_KEYS: ("requiresPassphrase" | "lockoutMs" | "accountStates" | "orgUserAccounts" | "cliKeyAccounts" | "pendingSelfHostedDeployments" | "defaultAccountId" | "defaultDeviceName" | "deviceKeyUpdatedAt" | "locked" | "unlockedAt" | "lastActiveAt" | "selfHostedUpgradesAvailable" | "skippedSelfHostedUpgradeAt" | "uiLastSelectedAccountId" | "uiLastSelectedUrl" | "v1UpgradeLoaded" | "v1ActiveUpgrade" | "hasV1PendingUpgrade" | "isCheckingV1PendingUpgrade" | "checkV1PendingUpgradeError")[];
export {};
//# sourceMappingURL=persistence.d.ts.map
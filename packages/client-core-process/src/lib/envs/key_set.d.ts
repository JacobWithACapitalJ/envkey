import { Draft } from "immer";
import { Client, Blob, Graph, Rbac } from "@envkey/core/types";
export declare const keySetForGraphProposal: (graph: Client.Graph.UserGraph, now: number, producer: (graphDraft: Draft<Client.Graph.UserGraph>) => void | Client.Graph.UserGraph, scope?: Rbac.OrgAccessScope) => Blob.KeySet, requiredEnvsForKeySet: (graph: Client.Graph.UserGraph, toSet: Blob.KeySet) => {
    requiredEnvs: Set<string>;
    requiredChangesets: Set<string>;
}, encryptedKeyParamsForKeySet: (params: {
    state: Client.State;
    context: Client.Context;
    toSet: Blob.KeySet;
}) => Promise<{
    keys?: {
        users?: Record<string, Record<string, Record<string, {
            environments?: Record<string, {
                env?: {
                    data?: string;
                    nonce?: string;
                };
                meta?: {
                    data?: string;
                    nonce?: string;
                };
                inherits?: {
                    data?: string;
                    nonce?: string;
                };
                inheritanceOverrides?: Record<string, {
                    data?: string;
                    nonce?: string;
                }>;
                changesets?: {
                    data?: string;
                    nonce?: string;
                };
                changesetsById?: Record<string, {
                    data?: {
                        data?: string;
                        nonce?: string;
                    };
                    createdAt?: number;
                    createdById?: string;
                }>;
            }>;
            locals?: Record<string, {
                env?: {
                    data?: string;
                    nonce?: string;
                };
                meta?: {
                    data?: string;
                    nonce?: string;
                };
                changesets?: {
                    data?: string;
                    nonce?: string;
                };
                changesetsById?: Record<string, {
                    data?: {
                        data?: string;
                        nonce?: string;
                    };
                    createdAt?: number;
                    createdById?: string;
                }>;
            }>;
        }>>>;
        keyableParents?: Record<string, Record<string, {
            env?: {
                data?: {
                    data?: string;
                    nonce?: string;
                };
            };
            inheritanceOverrides?: Record<string, {
                data?: {
                    data?: string;
                    nonce?: string;
                };
            }>;
            subEnv?: {
                data?: {
                    data?: string;
                    nonce?: string;
                };
            };
            localOverrides?: {
                data?: {
                    data?: string;
                    nonce?: string;
                };
            };
        }>>;
        blockKeyableParents?: Record<string, Record<string, Record<string, {
            env?: {
                data?: {
                    data?: string;
                    nonce?: string;
                };
            };
            inheritanceOverrides?: Record<string, {
                data?: {
                    data?: string;
                    nonce?: string;
                };
            }>;
            subEnv?: {
                data?: {
                    data?: string;
                    nonce?: string;
                };
            };
            localOverrides?: {
                data?: {
                    data?: string;
                    nonce?: string;
                };
            };
        }>>>;
        newDevice?: Record<string, {
            environments?: Record<string, {
                env?: {
                    data?: string;
                    nonce?: string;
                };
                meta?: {
                    data?: string;
                    nonce?: string;
                };
                inherits?: {
                    data?: string;
                    nonce?: string;
                };
                inheritanceOverrides?: Record<string, {
                    data?: string;
                    nonce?: string;
                }>;
                changesets?: {
                    data?: string;
                    nonce?: string;
                };
                changesetsById?: Record<string, {
                    data?: {
                        data?: string;
                        nonce?: string;
                    };
                    createdAt?: number;
                    createdById?: string;
                }>;
            }>;
            locals?: Record<string, {
                env?: {
                    data?: string;
                    nonce?: string;
                };
                meta?: {
                    data?: string;
                    nonce?: string;
                };
                changesets?: {
                    data?: string;
                    nonce?: string;
                };
                changesetsById?: Record<string, {
                    data?: {
                        data?: string;
                        nonce?: string;
                    };
                    createdAt?: number;
                    createdById?: string;
                }>;
            }>;
        }>;
    };
    encryptedByTrustChain?: {
        data?: string;
    };
    blobs?: Record<string, {
        environments?: Record<string, {
            env?: {
                data?: string;
                nonce?: string;
            };
            meta?: {
                data?: string;
                nonce?: string;
            };
            inherits?: {
                data?: string;
                nonce?: string;
            };
            inheritanceOverrides?: Record<string, {
                data?: string;
                nonce?: string;
            }>;
            changesets?: {
                data?: string;
                nonce?: string;
            };
            changesetsById?: Record<string, {
                data?: {
                    data?: string;
                    nonce?: string;
                };
                createdAt?: number;
                createdById?: string;
            }>;
        }>;
        locals?: Record<string, {
            env?: {
                data?: string;
                nonce?: string;
            };
            meta?: {
                data?: string;
                nonce?: string;
            };
            changesets?: {
                data?: string;
                nonce?: string;
            };
            changesetsById?: Record<string, {
                data?: {
                    data?: string;
                    nonce?: string;
                };
                createdAt?: number;
                createdById?: string;
            }>;
        }>;
    }>;
}>;
//# sourceMappingURL=key_set.d.ts.map
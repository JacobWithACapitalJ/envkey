import { Client } from "@envkey/core/types";
export declare const envParamsForEnvironments: (params: {
    state: Client.State;
    environmentIds: string[];
    context: Client.Context;
    message?: string;
    pending?: true;
    rotateKeys?: true;
    reencryptChangesets?: true;
    initEnvs?: true;
}) => Promise<{
    keys: {
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
    blobs: Record<string, {
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
    environmentKeysByComposite: Record<string, string>;
    changesetKeysByEnvironmentId: Record<string, string>;
}>;
//# sourceMappingURL=params.d.ts.map
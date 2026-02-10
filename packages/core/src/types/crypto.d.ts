import * as z from "zod";
export declare namespace Crypto {
    const PubkeySchema: z.ZodObject<{
        signature: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
    } & {
        keys: z.ZodObject<{
            signingKey: z.ZodString;
            encryptionKey: z.ZodString;
        }, {
            strict: true;
        }, {
            signingKey?: string;
            encryptionKey?: string;
        }>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        keys?: {
            signingKey?: string;
            encryptionKey?: string;
        };
        signature?: string;
    }>;
    const PrivkeySchema: z.ZodObject<{
        keys: z.ZodObject<{
            signingKey: z.ZodString;
            encryptionKey: z.ZodString;
        }, {
            strict: true;
        }, {
            signingKey?: string;
            encryptionKey?: string;
        }>;
    }, {
        strict: true;
    }, {
        keys?: {
            signingKey?: string;
            encryptionKey?: string;
        };
    }>;
    type Pubkey = z.infer<typeof PubkeySchema>;
    type Privkey = z.infer<typeof PrivkeySchema>;
    const EncryptedDataSchema: z.ZodObject<{
        data: z.ZodString;
        nonce: z.ZodString;
    }, {
        strict: true;
    }, {
        data?: string;
        nonce?: string;
    }>;
    type BinaryEncryptedData = {
        data: Uint8Array;
        nonce: Uint8Array;
    };
    type BinaryEncryptionKeypair = {
        pubkey: Uint8Array;
        privkey: Uint8Array;
    };
    type EncryptedData = z.infer<typeof EncryptedDataSchema>;
    const SignedDataSchema: z.ZodObject<{
        data: z.ZodString;
    }, {
        strict: true;
    }, {
        data?: string;
    }>;
    type SignedData = z.infer<typeof SignedDataSchema>;
    const PassphraseEncryptedDataSchema: z.ZodObject<{
        salt: z.ZodString;
    } & {
        data: z.ZodString;
        nonce: z.ZodString;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        data?: string;
        nonce?: string;
        salt?: string;
    }>;
    type PassphraseEncryptedData = z.infer<typeof PassphraseEncryptedDataSchema>;
    const KeypairSchema: z.ZodObject<{
        pubkey: z.ZodObject<{
            signature: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        } & {
            keys: z.ZodObject<{
                signingKey: z.ZodString;
                encryptionKey: z.ZodString;
            }, {
                strict: true;
            }, {
                signingKey?: string;
                encryptionKey?: string;
            }>;
        }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
            strict: true;
        }, {
            strict: true;
        }>, {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        }>;
        privkey: z.ZodObject<{
            keys: z.ZodObject<{
                signingKey: z.ZodString;
                encryptionKey: z.ZodString;
            }, {
                strict: true;
            }, {
                signingKey?: string;
                encryptionKey?: string;
            }>;
        }, {
            strict: true;
        }, {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
        }>;
    }, {
        strict: true;
    }, {
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        privkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
        };
    }>;
    type Keypair = z.infer<typeof KeypairSchema>;
    const EncryptedKeypairSchema: z.ZodObject<{
        pubkey: z.ZodObject<{
            signature: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        } & {
            keys: z.ZodObject<{
                signingKey: z.ZodString;
                encryptionKey: z.ZodString;
            }, {
                strict: true;
            }, {
                signingKey?: string;
                encryptionKey?: string;
            }>;
        }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
            strict: true;
        }, {
            strict: true;
        }>, {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        }>;
        encryptedPrivkey: z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>;
    }, {
        strict: true;
    }, {
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        encryptedPrivkey?: {
            data?: string;
            nonce?: string;
        };
    }>;
    type EncryptedKeypair = z.infer<typeof EncryptedKeypairSchema>;
    const PassphraseEncryptedKeypairSchema: z.ZodObject<{
        pubkey: z.ZodObject<{
            signature: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        } & {
            keys: z.ZodObject<{
                signingKey: z.ZodString;
                encryptionKey: z.ZodString;
            }, {
                strict: true;
            }, {
                signingKey?: string;
                encryptionKey?: string;
            }>;
        }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
            strict: true;
        }, {
            strict: true;
        }>, {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        }>;
        encryptedPrivkey: z.ZodObject<{
            salt: z.ZodString;
        } & {
            data: z.ZodString;
            nonce: z.ZodString;
        }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
            strict: true;
        }, {
            strict: true;
        }>, {
            data?: string;
            nonce?: string;
            salt?: string;
        }>;
    }, {
        strict: true;
    }, {
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        encryptedPrivkey?: {
            data?: string;
            nonce?: string;
            salt?: string;
        };
    }>;
    type PassphraseEncryptedKeypair = z.infer<typeof PassphraseEncryptedKeypairSchema>;
    const DecryptParamsSchema: z.ZodObject<{
        encrypted: z.ZodObject<{
            data: z.ZodString;
            nonce: z.ZodString;
        }, {
            strict: true;
        }, {
            data?: string;
            nonce?: string;
        }>;
    } & {
        pubkey: z.ZodObject<{
            signature: z.ZodUnion<[z.ZodString, z.ZodUndefined]>;
        } & {
            keys: z.ZodObject<{
                signingKey: z.ZodString;
                encryptionKey: z.ZodString;
            }, {
                strict: true;
            }, {
                signingKey?: string;
                encryptionKey?: string;
            }>;
        }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
            strict: true;
        }, {
            strict: true;
        }>, {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        }>;
        privkey: z.ZodObject<{
            keys: z.ZodObject<{
                signingKey: z.ZodString;
                encryptionKey: z.ZodString;
            }, {
                strict: true;
            }, {
                signingKey?: string;
                encryptionKey?: string;
            }>;
        }, {
            strict: true;
        }, {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
        }>;
    }, import("zod/lib/src/helpers/objectUtil").objectUtil.MergeObjectParams<{
        strict: true;
    }, {
        strict: true;
    }>, {
        pubkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
            signature?: string;
        };
        privkey?: {
            keys?: {
                signingKey?: string;
                encryptionKey?: string;
            };
        };
        encrypted?: {
            data?: string;
            nonce?: string;
        };
    }>;
    type DecryptParams = z.infer<typeof DecryptParamsSchema>;
}
//# sourceMappingURL=crypto.d.ts.map
const version = process.env.ENVKEY_CLI_BUILD_VERSION || "2.0.0";
import { Client } from "@envkey/core/types";

export const getContext = (
  accountIdOrCliKey?: string,
  store?: Client.ReduxStore,
  localSocketUpdate?: Client.LocalSocketUpdateFn
): Client.Context => ({
  client: {
    clientName: "core",
    clientVersion: version,
  },
  clientId: "core",
  accountIdOrCliKey,
  store,
  localSocketUpdate,
});

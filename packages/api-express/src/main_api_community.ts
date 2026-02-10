import "source-map-support/register";

import {
  registerEmailTransporter,
  getCommunityTransporter,
} from "../api-shared/src/email";
import { getCommunityLicense } from "../api-community/src/community_license";
if (process.env.NODE_ENV !== "production") {
  const path = require("path");
  const dotenv = require("dotenv");
  dotenv.config();
  dotenv.config({ path: path.resolve(process.cwd(), ".community.env") });
}

import { log } from "@envkey/core/lib/utils/logger";
import { registerVerifyLicenseFn } from "../api-shared/src/billing";
import startup from "./startup";
import {
  registerCommitLogsFn,
  registerSocketServer,
} from "../api-shared/src/handler";
import socketServer, { clearAllSockets } from "./socket";
import { ensureEnv } from "../api-shared/src/env";
import { commitLogStatements } from "../api-shared/src/models/logs";

ensureEnv("COMMUNITY_AUTH_HASH", "SMTP_TRANSPORT_JSON");

log("EnvKey API Community Edition is starting...");

const communityStartup = async () => {
  require("../api-community/src/api_handlers");
};

startup(
  communityStartup,
  async (port: number) => {
    registerVerifyLicenseFn(getCommunityLicense);
    registerEmailTransporter(getCommunityTransporter());
    socketServer.start();
    registerSocketServer(socketServer);
    registerCommitLogsFn(commitLogStatements);
  },
  async () => {
    clearAllSockets(false);
  }
)
  .then(() => {
    log("EnvKey API Community Edition has started!");
  })
  .catch((err) => {
    log("Initialization error:", { err });
    throw err;
  });

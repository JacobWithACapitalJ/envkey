import { Api } from "@envkey/core/types";
import { env } from "../../api-shared/src/env";

export const getCommunityLicense: Api.VerifyLicenseFn = () => ({
  type: "license",
  id: "community-license",
  env: env.NODE_ENV,
  orgBillingId: "community-billing-id",
  plan: "free",
  hostType: "community",
  expiresAt: -1,
  maxUsers: -1,
  maxDevices: -1,
  maxServerEnvkeys: -1,
  createdAt: 0,
});

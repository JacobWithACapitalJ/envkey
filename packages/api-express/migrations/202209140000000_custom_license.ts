import { env } from "../api-shared/src/env";
import * as Knex from "knex";
import {
  getNewTransactionConn,
  releaseTransaction,
  executeTransactionStatements,
} from "../api-shared/src/db";
import { getAllOrgs } from "../api-shared/src/models/orgs";
import { putDbStatement } from "../api-shared/src/db_fns";

export const up = async (knex: Knex) => {
  if (env.IS_CLOUD) {
    const now = Date.now();
    const transactionConn = await getNewTransactionConn();

    try {
      const orgs = await getAllOrgs(transactionConn);

      await executeTransactionStatements(
        orgs
          .filter((org) => org.signedLicense)
          .map((org) =>
            putDbStatement({
              ...org,
              customLicense: true,
              graphUpdatedAt: now,
              updatedAt: now,
            })
          ),
        transactionConn
      );
    } finally {
      await releaseTransaction(transactionConn);
    }
  }
};

export const down = async (knex: Knex) => {};

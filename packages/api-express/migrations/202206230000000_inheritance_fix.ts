import * as Knex from "knex";
import {
  getNewTransactionConn,
  releaseTransaction,
  executeTransactionStatements,
} from "../api-shared/src/db";
import { getAllOrgs } from "../api-shared/src/models/orgs";
import { putDbStatement } from "../api-shared/src/db_fns";

export const up = async (knex: Knex) => {
  const now = Date.now();
  const transactionConn = await getNewTransactionConn();

  try {
    const orgs = await getAllOrgs(transactionConn);

    await executeTransactionStatements(
      orgs.map((org) =>
        putDbStatement({
          ...org,
          envUpdateRequiresClientVersion: "2.1.0",
          graphUpdatedAt: now,
        })
      ),
      transactionConn
    );
  } finally {
    await releaseTransaction(transactionConn);
  }
};

export const down = async (knex: Knex) => {};

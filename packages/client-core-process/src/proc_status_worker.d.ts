/// <reference types="node" />
import { Worker } from "cluster";
import { Client } from "@envkey/core/types";
export declare const setWorker: (w: Worker) => void;
export declare const waitForStart: () => Promise<void>;
export declare const handleWorkerToMainMessage: (handler: (message: Client.WorkerToMainProcessMessage) => Promise<void>) => void;
export declare const sendMainToWorkerMessage: (message: Client.MainToWorkerProcessMessage) => void;
export declare const kill: (signal?: string) => void;
export declare const sendWorkerToMainMessage: (message: Client.WorkerToMainProcessMessage) => void;
//# sourceMappingURL=proc_status_worker.d.ts.map
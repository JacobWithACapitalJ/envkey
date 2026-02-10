"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("../handler");
const types_1 = require("@envkey/core/types");
const status_1 = require("../lib/status");
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.UPDATE_LICENSE, loggableType: "orgAction", loggableType2: "billingAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.statusProducers)("isUpdatingLicense", "updateLicenseError")));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.FETCH_ORG_STATS, loggableType: "authAction", authenticated: true }, (0, status_1.statusProducers)("isFetchingOrgStats", "fetchOrgStatsError")), { successStateProducer: (draft, { payload: { orgStats } }) => {
        draft.orgStats = orgStats;
    } }));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.CLOUD_BILLING_SUBSCRIBE_PRODUCT, loggableType: "orgAction", loggableType2: "billingAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.statusProducers)("cloudBillingIsSubscribingProduct", "cloudBillingSubscribeProductError")));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.CLOUD_BILLING_UPDATE_SUBSCRIPTION_QUANTITY, loggableType: "orgAction", loggableType2: "billingAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.statusProducers)("cloudBillingIsUpdatingSubscriptionQuantity", "cloudBillingUpdateSubscriptionQuantityError")));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.CLOUD_BILLING_CANCEL_SUBSCRIPTION, loggableType: "orgAction", loggableType2: "billingAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.statusProducers)("cloudBillingIsCancelingSubscription", "cloudBillingCancelSubscriptionError")));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.CLOUD_BILLING_UPDATE_PAYMENT_METHOD, loggableType: "orgAction", loggableType2: "billingAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.statusProducers)("cloudBillingIsUpdatingPaymentMethod", "cloudBillingUpdatePaymentMethodError")));
(0, handler_1.clientAction)(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.CLOUD_BILLING_UPDATE_SETTINGS, loggableType: "orgAction", loggableType2: "billingAction", authenticated: true, graphAction: true, serialAction: true }, (0, status_1.statusProducers)("cloudBillingIsUpdatingSettings", "cloudBillingUpdateSettingsError")));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.CLOUD_BILLING_FETCH_INVOICES, loggableType: "authAction", loggableType2: "billingAction", authenticated: true }, (0, status_1.statusProducers)("cloudBillingIsFetchingInvoices", "cloudBillingFetchInvoicesError")), { successStateProducer: (draft, { payload: { invoices } }) => {
        draft.cloudBillingInvoices = invoices;
    } }));
(0, handler_1.clientAction)({
    type: "apiRequestAction",
    actionType: types_1.Api.ActionType.CLOUD_BILLING_CHECK_PROMOTION_CODE,
    loggableType: "authAction",
    loggableType2: "billingAction",
    authenticated: true,
    stateProducer: (draft, action) => {
        draft.cloudBillingCheckPromotionCodeError = undefined;
        draft.cloudBillingPromotionCode = undefined;
        draft.cloudBillingIsCheckingPromotionCode = true;
    },
    failureStateProducer: (draft, action) => {
        draft.cloudBillingCheckPromotionCodeError = action.payload;
    },
    endStateProducer: (draft, action) => {
        draft.cloudBillingIsCheckingPromotionCode = undefined;
    },
    successStateProducer: (draft, { payload: { exists, amountOff, percentOff }, meta }) => {
        if (exists) {
            draft.cloudBillingPromotionCode = {
                code: meta.rootAction.payload.code,
                amountOff,
                percentOff,
            };
        }
        else {
            draft.cloudBillingPromotionCode = undefined;
        }
    },
});
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.CLOUD_BILLING_LOAD_PRODUCTS, loggableType: "hostAction", authenticated: undefined }, (0, status_1.statusProducers)("isLoadingCloudProducts", "loadCloudProductsError")), { successStateProducer: (draft, { payload: { products, prices } }) => {
        draft.cloudProducts = products;
        draft.cloudPrices = prices;
    } }));
(0, handler_1.clientAction)(Object.assign(Object.assign({ type: "apiRequestAction", actionType: types_1.Api.ActionType.CLOUD_BILLING_CHECK_V1_PENDING_UPGRADE, loggableType: "hostAction", authenticated: undefined }, (0, status_1.statusProducers)("isCheckingV1PendingUpgrade", "checkV1PendingUpgradeError")), { successStateProducer: (draft, { payload: { hasPendingUpgrade } }) => {
        draft.hasV1PendingUpgrade = hasPendingUpgrade;
    } }));
//# sourceMappingURL=billing.js.map
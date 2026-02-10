import { Db } from "./db";
export declare namespace Graph {
    type GraphObject = Db.Org | Db.OrgRole | Db.AppRole | Db.EnvironmentRole | Db.AppRoleEnvironmentRole | Db.Group | Db.AppUserGroup | Db.AppGroupUserGroup | Db.AppGroupUser | Db.AppGroupBlock | Db.AppBlockGroup | Db.AppGroupBlockGroup | Db.Server | Db.LocalKey | Db.IncludedAppRole | Db.Environment | Db.VariableGroup | Db.GeneratedEnvkey | Db.OrgUserDevice | Db.OrgUser | Db.CliUser | Db.RecoveryKey | Db.DeviceGrant | Db.Invite | Db.App | Db.Block | Db.AppUserGrant | Db.AppBlock | Db.GroupMembership | Db.PubkeyRevocationRequest | Db.RootPubkeyReplacement | Db.ExternalAuthProvider | Db.ScimProvisioningProvider | Db.Product | Db.Price | Db.Customer | Db.Subscription | Db.PaymentSource | Db.VantaConnectedAccount;
    type OrgGraph = {
        [id: string]: GraphObject;
    };
    type Scope = GraphObject["type"];
    type BaseScopeType = (Db.Org | Db.OrgRole | Db.AppRole | Db.EnvironmentRole | Db.AppRoleEnvironmentRole | Db.PubkeyRevocationRequest | Db.RootPubkeyReplacement | Db.ExternalAuthProvider | Db.ScimProvisioningProvider)["type"];
    type NonBaseScopeType = Exclude<Scope, BaseScopeType>;
    const baseScopeTypes: BaseScopeType[];
}
//# sourceMappingURL=graph.d.ts.map
import { ApplicationMetric } from './applicationMetric';

export class MinionDetail {
    MinionId: number;
    SiteId: string;
    SiteName: string;
    ServerName: string;
    Status: string;
    OperatingSystem: string;
    MinionVersion: string;
    LastHeartBeat: string;
    ApplicationMetrics: ApplicationMetric[];
    MobileSubscriptions: number;
    MobileUsers: MobileUser[];
    noMobileAvailable: number;
    ActiveMobileUsers: number;
}

export interface MobileUser {
    MobileUsername: string;
    ActivatedDate: string;
    DecoupledDate: string;
}

export interface EditMinionDetails {
    SiteId: string;
    SiteName: string;
    MobileSubscriptions: number;
}

export class MinionGroup {
    MinionIds: string;
}

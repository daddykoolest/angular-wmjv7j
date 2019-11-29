export class CommandScheduleItem {
    Id: number;
    CommandGroupMembershipId: number;
    CommandType: number;
    Interval: number;
    RunUntilDate: string;
    LastScheduledDate: string;
    WhileStatus: number;
    ExcludeWeekends: boolean;
    CoreHoursOnly: boolean;
    Parameters: string;
    CommandVersion: string;
}

import { Parameters } from './parameters';

export class CommandType {
    Id: number;
    GroupMembershipId: number;
    Name: string;
    Description: string;
    DefaultParameters: Parameters[];
    ScheduleRequired: boolean;
    RunUntilDate: Date;
    Interval: number;
    IntervalUnits: string;
    CoreHoursOnly: boolean;
    ExcludeWeekends: boolean;
    WhileStatus: number;
    Order: number;
}

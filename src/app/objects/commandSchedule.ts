import { CommandScheduleItem } from './commandScheduleItem';

export class CommandSchedule {
    CommandGroupId: number;
    MinionGroupId: number;
    ScheduleDate: string;
    ScheduledBy: number;
    CommandScheduleItems: Array<CommandScheduleItem>;
}

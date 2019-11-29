export class Command {
    Minion: string;
    CommandGroup: string;
    ScheduleDate: string;
    Parameters: CommandParameters;
    AcknowledgementRequired: boolean;
    CommandVersion: CommandVersions;
    UserId: number;
}

export class CommandParameters {
    CommandParameters: any;
}

export class CommandVersions {
    CommandVersions: string;
}
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommandSchedule } from 'src/app/objects/commandSchedule';
import { CommandType } from 'src/app/objects/commandType';
import { CommandScheduleItem } from 'src/app/objects/commandScheduleItem';
import { Result } from 'src/app/objects/result';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class CreateScheduleService {

  private API_URL = environment.API_URL;

  private createScheduleUrl = this.API_URL + 'api/scheduler/create';
  private responses = new Result();

  constructor(private http: HttpClient) { }

      async createSchedules(minionGroupId: number): Promise<Result> {
      this.responses = new Result();

      const commandGroupId = Object.keys(JSON.parse(localStorage.getItem('commandChosen')))[0];
      const commandTypes = JSON.parse(localStorage.getItem('parameters'));

      // create schedule for primary command group
      const schedule = this.buildSchedule(minionGroupId, parseInt(commandGroupId, 10), this.getUserId(), commandTypes);
      await this.createSchedule(schedule)
        .then(resp => { this.responses = resp; })
          .catch((error) => this.responses.ResultErrors.push(error.error));

          // return all responses including HTTP response and any errors
      return this.responses;
    }

    buildSchedule(minionGroupId: number, commandGroupId: number, userId: number,
                  commandTypes: CommandType[]): CommandSchedule {

      try {
        const schedule = new CommandSchedule();
        schedule.CommandScheduleItems = new Array<CommandScheduleItem>();
        const scheduledDateLocal = localStorage.getItem('scheduledDate');
        const scheduledDateUTC = new Date(scheduledDateLocal).toISOString().replace('Z', '');
        // set primary schedule details
        schedule.MinionGroupId = minionGroupId;
        schedule.ScheduledBy = userId;
        schedule.ScheduleDate = scheduledDateUTC;
        schedule.CommandGroupId = commandGroupId;
        // create new schedule item for each command type
        const commandTypesValues = Object.keys(commandTypes).map(commandtypeItem => commandTypes[commandtypeItem]);
        commandTypesValues.forEach(commandType => {
          const scheduleItem = new CommandScheduleItem();
          scheduleItem.CommandGroupMembershipId = parseInt(commandType.GroupMembershipId, 10);
          scheduleItem.CommandType = +commandType.Id;
          scheduleItem.CoreHoursOnly = commandType.CoreHoursOnly;
          scheduleItem.ExcludeWeekends = commandType.ExcludeWeekends;
          scheduleItem.Interval = +commandType.Interval;
          scheduleItem.WhileStatus = +commandType.WhileStatus;
          scheduleItem.RunUntilDate = commandType.RunUntilDate === null || typeof commandType.RunUntilDate === 'undefined' ? null :
            new Date(commandType.RunUntilDate).toUTCString();
          const parsedParams = {};
          const defaultParams = Object.keys(commandType.DefaultParameters).map(paramItem => commandType.DefaultParameters[paramItem]);

          defaultParams.forEach(item => {
            parsedParams[item.name] = item.value;
          });

          if (Object.keys(parsedParams).map(parsedParamItem => parsedParams[parsedParamItem]).length > 0)  {
            scheduleItem.Parameters = JSON.stringify(parsedParams);
          }

          // add to list of schedule items
          schedule.CommandScheduleItems.push(scheduleItem);
        });

        return schedule;
      } catch (e) {
        console.log('There was a problem building the schedule: ' + e.message);
        this.responses.ResultErrors.push(e.message);
      }
    }

    getUserId(): number {
      let userId: number;
      const jwtHelper = new JwtHelperService();
      const token = jwtHelper.decodeToken(localStorage.getItem('token'));
      if (token != null) {
        userId = token.userId;
      }
      return userId;
    }

   async createSchedule(commandSchedule: CommandSchedule): Promise <Result> {
      const result = new Result();
      result.ResultErrors = [];
      const response = await this.http.post<CommandSchedule>(this.createScheduleUrl, commandSchedule, {observe: 'response'}).toPromise();
      if (response.status === 201) {
          result.ResultStatus = true;
          result.ResultClass = 'alert-success';
          result.ResultHeader = 'Success';
          result.ResultIcon = 'date_range';
          result.ResultMessage = 'Schedule created';
      } else {
        result.ResultStatus = false;
        result.ResultClass = 'alert-danger';
        result.ResultHeader = 'Warning';
        result.ResultIcon = 'report_problem';
        result.ResultMessage = 'Failed to create schedule';
        result.ResultErrors.push(response.status.toString() + ' : ' + response.statusText);
      }
      return result;
    }
}


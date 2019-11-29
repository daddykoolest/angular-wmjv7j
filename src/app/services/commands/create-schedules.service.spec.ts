import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CreateScheduleService } from './create-schedules.service';
import { of } from 'rxjs/internal/observable/of';
import { CommandService } from './command.service';
import { MinionGroup } from 'src/app/objects/minionDetail';

describe('CreateCommandService', () => {
  let httpClientSpy: { post: jasmine.Spy};
  let createCommandService: CreateScheduleService;
  let store = {};
  let spy = {};



  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake((key: string | number) => {
      return store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake((key: string | number, value: string) => {
      return store[key] = value + '';
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string | number) => {
      delete store[key];
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
        store = {};
    });
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [HttpClient]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    createCommandService = new CreateScheduleService(httpClientSpy as any);
    localStorage.setItem('scheduledDate', '2019-01-01T09:00:00Z');
    localStorage.setItem('commandChosen', '{"1":"LoopbackTest"}');
    localStorage.setItem('parameters', '[{"Id":12,"GroupMembershipId":4,"Name":"VLVersion","DefaultParameters":[{"commandTypeId":12,"commandTypeName":"VLVersion","name":"MinimumVersion","value":"1.2.4.4"}],"ScheduleRequired":true,"IntervalUnits":"500000", "Interval":"10","WhileStatus":3}]');
    localStorage.setItem('minionChosen', '{"5":"SomeSurgery"}');
    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiVXNlcklkIjoiMyIsImlhdCI6MTUxNjIzOTAyMn0.AOsPzBP9svrlRBMx2sNBPiWRwKtouOmqLQTK12bPFfc');

  });

  it('should be created', () => {
    expect(createCommandService).toBeTruthy();
  });

  it('should build schedule', () => {
    spy = spyOn(createCommandService, 'buildSchedule').and.callThrough();
    createCommandService.createSchedules(1);
    expect(createCommandService.buildSchedule).toHaveBeenCalled();
  });

  it('should call create schedule', () => {
    spy = spyOn(createCommandService, 'createSchedule').and.callThrough();
    createCommandService.createSchedules(1);
    expect(createCommandService.createSchedule).toHaveBeenCalled();
  });


});

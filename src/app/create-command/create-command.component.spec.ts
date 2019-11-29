import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateCommandComponent } from './create-command.component';
import { CreateScheduleService } from '../services/commands/create-schedules.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { FormsModule, NgForm, Validators, ReactiveFormsModule } from '@angular/forms';
import { Result } from '../objects/result';
import { MinionService } from '../services/minion/minion.service';
import { MinionGroup } from '../objects/minionDetail';
import { doesNotThrow } from 'assert';
import { Router } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MaterialModule } from '../shared/material.module';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MinionsComponent } from '../minions/minions.component';
import { CommandsComponent } from '../commands/commands.component';
import { ToastService } from '../services/toast/toast.service';
import { of } from 'rxjs';

const data = [{
  MinionId: 1,
  SiteId: 'TestId',
  SiteName: 'TestName',
  ServerName: 'Server Name',
  Status: 'Red',
  OperatingSystem: 'Windows 10',
  MinionVersion: '0.9.0.7'
}];

class MockSrv {
  private API_URL = 'http://test/';

  private loginUrl = this.API_URL + 'api/user/login';

  private http = new HttpClient(this.loginUrl);

  handleError() {
    return HttpErrorResponse;
  }
}

class MockMinionSrv {
  private API_URL = 'http://test/';

  private loginUrl = this.API_URL + 'api/user/login';

  private http = new HttpClient(this.loginUrl);

  handleError() {
    return HttpErrorResponse;
  }
  createMinionGroup(minionGroup: MinionGroup) {
    return 10;
  }
  getAllMinions() {
    return of(data);
  }
}

describe('CreateCommandComponent', () => {
  let component: CreateCommandComponent;
  let fixture: ComponentFixture<CreateCommandComponent>;
  let theMinionService: { createMinionGroup: any; };
  let store = {};
  let spy: any;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  const commandsComponent = jasmine.createSpyObj('CommandsComponent', ['resetAll']);
  const minionsComponent = jasmine.createSpyObj('MinionsComponent', ['totalMinionsSelected']);

  beforeEach(async(() => {

    spyOn(localStorage, 'getItem').and.callFake((key: string | number) => {
      return typeof store[key] === 'undefined' ? null : store[key];
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
      imports: [HttpClientTestingModule, FormsModule, BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(), MaterialModule, MatStepperModule, BrowserAnimationsModule, NoopAnimationsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ CreateCommandComponent, MinionsComponent, CommandsComponent ],
      providers: [
        CreateCommandComponent,
        {provide: CreateScheduleService, useClass: MockSrv},
        { provide: MinionService, useClass: MockMinionSrv },
        { provide: Router, useValue: mockRouter},
        { provide: ToastService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCommandComponent);
    theMinionService = TestBed.get(MinionService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show the starter splash by default', () => {
    localStorage.setItem('commandStarted', 'false');
    expect(component.showSplash()).toBe(false);
  });

  it('should show the starter splash if started', () => {
    localStorage.setItem('commandStarted', 'true');
    component.ngOnInit();
    expect(component.showSplash()).toBe(true);
  });

  it('should not show the splash once continued', () => {
    localStorage.setItem('commandStarted', 'true');
    component.ngOnInit();
    component.continueCommand();
    expect(component.showSplash()).toBe(false);
  });

  it('should move step forward when next is clicked', () => {
    component.theMinions = minionsComponent;
    localStorage.setItem('currentStep', '1');
    localStorage.setItem('commandChosen', '{"2": "TestGroup"}');
    component.goForward();
    expect(minionsComponent.totalMinionsSelected).toHaveBeenCalled();
  });

  it('should move step backwards when next is clicked', () => {
    localStorage.setItem('currentStep', '1');
    component.goBack();
    expect(localStorage.getItem('currentStep')).toBe('1');
  });

  it('should be like new when startOver is called', () => {
    component.theCommands = commandsComponent;
    localStorage.setItem('commandChosen', '0');
    localStorage.setItem('currentStep', '0');
    localStorage.setItem('minionChosen', '0');
    localStorage.setItem('parameters', null);
    localStorage.setItem('commandStarted', 'false');

    expect(Object.keys(store).length).toBe(5);

    component.startOver();
    expect(commandsComponent.resetAll).toHaveBeenCalled();
    expect(Object.keys(store).length).toBe(1); // currentStep will be set to 0
  });

  it('should display result section', () => {
    localStorage.setItem('currentStep', '3');
    component.result.ResultStatus = true;
    component.result.ResultErrors = ['It happened no errors'];
    component.showScheduleResult();
    expect(component.showConfirmation()).toBe(true);
  });

  it('should show create schedule btn', () => {
    localStorage.setItem('currentStep', '3');
    component.result.ResultStatus = false;
    component.result.ResultErrors = ['something went wrong'];
    component.showScheduleResult();
    expect(component.showCreateScheduleBtn).toBe(true);
  });

  it('should hide create schedule btn when completed sucessfully', () => {
    localStorage.setItem('currentStep', '3');
    component.result.ResultStatus = true;
    component.result.ResultErrors = [];
    component.showScheduleResult();
    expect(component.showCreateScheduleBtn).toBe(false);
  });

  it('should set the command step label when moving to the first step', () => {
    const event = { previouslySelectedIndex: 1, selectedIndex: 0 };
    localStorage.setItem('commandChosen', '{"3":"TestCommand"}');
    component.stepChange(event);
    expect(component.commandStepLabel).toBe('TestCommand');
    expect(component.minionStepLabel).toBe('Choose Minions');
  });

  it('should set the minion step label when moving from step', () => {
    const event = { previouslySelectedIndex: 1, selectedIndex: 2 };
    localStorage.setItem('minionChosen', '{"3":"DEF","10014":"ABE"}');
    component.stepChange(event);
    expect(component.minionStepLabel).toBe('2 Minion(s) Selected');
  });
});

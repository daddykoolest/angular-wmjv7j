import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { CreateScheduleService } from '../services/commands/create-schedules.service';
import { MinionService } from '../services/minion/minion.service';
import { MinionGroup } from '../objects/minionDetail';
import { Result } from '../objects/result';
import { Router } from '@angular/router';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { MinionsComponent } from '../minions/minions.component';
import { CommandsComponent } from '../commands/commands.component';

@Component({
  selector: 'app-create-command',
  templateUrl: './create-command.component.html',
  styleUrls: ['./create-command.component.css']
})
export class CreateCommandComponent implements OnInit {
  @ViewChild(BsDatepickerDirective, { read: true, static: false }) datepicker: BsDatepickerDirective;
  @ViewChild(CommandsComponent, {static: false}) theCommands: CommandsComponent;
  @ViewChild(MinionsComponent, { static: false }) theMinions: MinionsComponent;

minDate: Date;
  scheduledDate: Date;
  showStarterSplash = false;
  showResult = false;
  showCreateScheduleBtn = true;
  commandName = '';
  minionNames = '';
  minionList = '';
  parameters = '';
  minionGroup = new MinionGroup();
  result = new Result();
  lockElements = false;
  nextStep: any;
  previousStep: any;

  isLinear = true;
  commnadFormGroup: FormGroup;
  minionFormGroup: FormGroup;
  parameterFormGroup: FormGroup;
  createFormGroup: FormGroup;

  commandStepLabel = 'Choose Command';
  minionStepLabel = 'Choose Minions';
  parameterStepLabel = 'Parameters';

  message: string;

  @HostListener('window:scroll')
  onScrollEvent() {
    if (this.datepicker) {
      this.datepicker.hide();
    }
  }


  constructor(
    private createCommandService: CreateScheduleService,
    private minionService: MinionService,
    private router: Router,
    private _formBuilder: FormBuilder) {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
  }

  ngOnInit() {
    this.scheduledDate = new Date();
    const commandStarted = localStorage.getItem('commandStarted');
    if (commandStarted !== null && commandStarted === 'true') {
      this.showStarterSplash = true;
    }
    if (localStorage.getItem('currentStep') === null) {
      localStorage.setItem('currentStep', '0');
    }

    this.result.ResultStatus = false;
    this.result.ResultClass = 'alert-danger';
    this.result.ResultHeader = 'Warning';
    this.result.ResultIcon = 'report_problem';
    this.result.ResultMessage = 'Commands not scheduled';
    this.result.ResultErrors = [];

    this.commnadFormGroup = this._formBuilder.group({
      firstCtrl: ['']
    });
    this.minionFormGroup = this._formBuilder.group({
      secondCtrl: ['']
    });
    this.parameterFormGroup = this._formBuilder.group({
      thirdCtrl: ['']
    });
    this.createFormGroup = this._formBuilder.group({
      fourthCtrl: ['']
    });
  }

  showSplash(): boolean {
    return this.showStarterSplash;
  }

  showConfirmation(): boolean {
    return this.showResult;
  }

  commandSelected(event: any) {
    this.message = event;
    $('#firstStepNextBtn').prop('disabled', false);
    if (event === 'Command selected' && localStorage.getItem('minionChosen') === null) {
      this.minionStepLabel = 'Choose Minions';
      $('#secondStepNextBtn').prop('disabled', true);
    }
  }

  minionSelected($event) {
    this.message = $event;
    if (localStorage.getItem('minionChosen') !== null && Object.keys(JSON.parse(localStorage.getItem('minionChosen'))).length > 0) {
      $('#secondStepNextBtn').prop('disabled', false);
    } else {
      $('#secondStepNextBtn').prop('disabled', true);
    }
  }

  startOver(): void {
    this.resetItems();
    localStorage.setItem('currentStep', '0');
  }

  resetItems(): void {
    this.result = new Result();
    this.result.ResultStatus = false;
    this.result.ResultMessage = 'Commands not scheduled';
    this.result.ResultErrors = [];
    this.showStarterSplash = false;
    this.showResult = false;
    this.showCreateScheduleBtn = true;
    localStorage.removeItem('commandChosen');
    localStorage.removeItem('minionChosen');
    localStorage.removeItem('parameters');
    localStorage.removeItem('commandStarted');
    localStorage.removeItem('scheduledDate');
    this.scheduledDate = new Date();
    this.lockElements = false;
    this.commandStepLabel = 'Choose Command';
    this.minionStepLabel = 'Choose Minions';
    this.parameterStepLabel = 'Parameters';
    $('#firstStepNextBtn').prop('disabled', true);
    $('#secondStepNextBtn').prop('disabled', true);
    if (this.theCommands !== undefined) {
      this.theCommands.resetAll();
    }
  }

  goHome(): void {
    this.resetItems();
    localStorage.removeItem('currentStep');
  }

  continueCommand(): void {
    if (localStorage.getItem('currentStep') === null) {
      if (localStorage.getItem('parameters') !== null) {
        localStorage.setItem('currentStep', '2');
      } else if (localStorage.getItem('minionChosen') !== null) {
        localStorage.setItem('currentStep', '1');
      } else if (localStorage.getItem('commandChosen') !== null) {
        localStorage.setItem('currentStep', '0');
      }
    }
    this.showStarterSplash = false;
  }

  stepChange(event: any): void {
    this.nextStep = event.selectedIndex;
    this.previousStep = event.previouslySelectedIndex;
    localStorage.setItem('currentStep', (this.nextStep).toString());
    if (this.nextStep === 0) {
      const command = localStorage.getItem('commandChosen');
      if (command !== null) {
        const parsedCommand = JSON.parse(command);
        if (this.commandStepLabel !== parsedCommand[Object.keys(parsedCommand)[0]]) {
          this.commandStepLabel = parsedCommand[Object.keys(parsedCommand)[0]];
        }
      }
    }
    if (this.previousStep === 1) {
      if (localStorage.getItem('minionChosen') === null) {
        $('#secondStepNextBtn').prop('disabled', true);
        this.minionStepLabel = 'Choose Minions';
      } else {
        const minions = Object.keys(JSON.parse(localStorage.getItem('minionChosen'))).length;
        this.minionStepLabel = minions + ' Minion(s) Selected';
      }
    }
  }

  goBack(): void {
    if (this.nextStep  === 0 ) {
      this.commandStepLabel = 'Choose Command';
    } else if (this.nextStep === 1) {
      this.minionStepLabel = 'Choose Minions';
    } else if (this.nextStep === 2) {
      this.parameterStepLabel = 'Parameters';
    }
  }

  goForward(): void {
    const current = parseInt(localStorage.getItem('currentStep'), 10);
    if (current === 1) {
      const command = localStorage.getItem('commandChosen');
      const parsedCommand = JSON.parse(command);
      this.commandStepLabel = parsedCommand[Object.keys(parsedCommand)[0]];
      this.theMinions.totalMinionsSelected();
    } else if (current === 2) {
      const minions = Object.keys(JSON.parse(localStorage.getItem('minionChosen'))).length;
      this.minionStepLabel = minions + ' Minion(s) Selected';
    } else if (current === 3) {
      this.parameterStepLabel = 'Parameters Set';
    }
  }

  getCommandSummaryDetails(): void {
    this.minionList = localStorage.getItem('minionChosen');
    const command = localStorage.getItem('commandChosen');
    if (this.minionList !== null && command !== null) {
      const parsedCommand = JSON.parse(command);
      this.commandName = parsedCommand[Object.keys(parsedCommand)[0]];
      const minionListParsed = JSON.parse(this.minionList);
      this.minionNames = Object.keys(minionListParsed).map(minionListItem => minionListParsed[minionListItem]).join(', ');
    }
  }

  calculateIntervalInSeconds(): void {
    const commandTypes = JSON.parse(localStorage.getItem('parameters'));
    commandTypes.forEach(commandType => {
      if (commandType.IntervalUnits) {
        const intervalUnits = commandType.IntervalUnits;
        let intervalSeconds = 0;
        switch (intervalUnits) {
          case '500000':
            intervalSeconds = parseInt(commandType.Interval, 10) * 60;
            break;
          case '8700':
            intervalSeconds = parseInt(commandType.Interval, 10) * 3600;
            break;
          case '366':
            intervalSeconds = parseInt(commandType.Interval, 10) * 86400;
            break;
          case '52':
            intervalSeconds = parseInt(commandType.Interval, 10) * 604800;
            break;
        }
        commandType.Interval = intervalSeconds;
      }
    });
    localStorage.setItem('parameters', JSON.stringify(commandTypes));
  }

  currentStep(): string {
    this.getCommandSummaryDetails();
    return localStorage.getItem('currentStep') !== null ? localStorage.getItem('currentStep') : '0';
  }

  showSubmit(): string {
    const step = localStorage.getItem('currentStep');
    if (step !== null && step === '3' && this.showCreateScheduleBtn === true) { return 'true'; }
    return 'false';
  }

  disableElements(): boolean {
    return this.lockElements;
  }

  createCommand(): void {
    this.lockElements = true;
    this.result.ResultErrors = [];
    // store scheduled date
    this.calculateIntervalInSeconds();
    localStorage.setItem('scheduledDate', this.scheduledDate.toUTCString());
    this.minionGroup.MinionIds = Object.keys(JSON.parse(this.minionList)).toString();
    // get minion group id then create schedule
    let minionGroupId = 0;
    this.minionService.createMinionGroup(this.minionGroup)
    .subscribe((groupId: number) => { minionGroupId = groupId; },
        (err: Error) => { console.log('Error creating minion group: ' + err.message);
                          this.result.ResultErrors.push(err.message); this.showScheduleResult(); },
          () => {
            if (this.result.ResultErrors.length === 0) {
              this.createScheduleForMinionGroup(minionGroupId);
            }
            });
  }

  async createScheduleForMinionGroup(id: number): Promise<void> {
    await this.createCommandService.createSchedules(id)
      .then(res => {this.result = res; })
        .catch((err: Error) => { this.result.ResultErrors.push(err.message); console.log('Error creating schedule: ' + err.message); })
          .finally(() => this.showScheduleResult());
  }

  showScheduleResult() {
    // result ok and no errors
    if (this.result.ResultStatus === true && this.result.ResultErrors.length === 0) {
      this.showCreateScheduleBtn = false;
      localStorage.removeItem('parameters');
      localStorage.removeItem('commandChosen');
      localStorage.removeItem('commandStarted');
      localStorage.removeItem('minionChosen');
      localStorage.removeItem('scheduledDate');
    } else if (this.result.ResultErrors.length > 0) {
      this.result.ResultErrors.forEach(errorMsg => {
        console.log(errorMsg);
      });
      this.lockElements = false;
    } else {
      console.log('unknown error');
    }
    this.showResult = true;
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { ParametersService } from '../services/parameters/parameters.service';
import { Parameters, ParameterDisplaySettings } from '../objects/parameters';
import { ActivatedRoute } from '@angular/router';
import { CommandType } from '../objects/commandType';
import { stringify } from 'querystring';
import { isEmpty } from 'rxjs/operators';
import * as $ from 'jquery';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css'],
})
export class ParametersComponent implements OnInit {
  parameters: Parameters[];
  commandTypes: CommandType[];
  commandGroupId: string;
  intervalMin = 0;
  intervalMax = 500000;
  minDate: Date;

  constructor(private parametersService: ParametersService, private activatedRoute: ActivatedRoute) {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.commandTypes = [];
  }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem('commandChosen')) !== null) {
      this.commandGroupId = Object.keys(JSON.parse(localStorage.getItem('commandChosen')))[0];
    } else {
      this.activatedRoute.snapshot.paramMap.get('id');
    }
    this.getParameters();
  }

  disableElements(): boolean {
    return localStorage.getItem('currentStep') === '3' ? true : false;
  }

  commandsSaved(): boolean {
    return localStorage.getItem('parameters') !== null ? true : false;
  }

  getParameters(): void {
    if (JSON.parse(localStorage.getItem('parameters')) !== null) {
      this.commandTypes = JSON.parse(localStorage.getItem('parameters'));
      this.commandTypes.forEach(item => {
        item.RunUntilDate = new Date(item.RunUntilDate);
      });
    } else {
      const commandGroupIdInt = parseInt(this.commandGroupId, 10);
      this.parametersService.getCommandGroupParameters(commandGroupIdInt)
      .subscribe(data => { this.commandTypes = this.parseParametersObject(data).sort((a, b) => a.Order - b.Order); },
        (err: Error) => console.log('Error getting parameters: ' + err.message));
    }

  }

  goBack(): void {
    const current = parseInt(localStorage.getItem('currentStep'), 10);
    localStorage.setItem('currentStep', (current - 1).toString());
  }

  currentStep(): string {
    return localStorage.getItem('currentStep') !== null ? localStorage.getItem('currentStep') : '1';
  }

  goForward(): void {
    const current = parseInt(localStorage.getItem('currentStep'), 10);
    if (current !== 4) {
      localStorage.setItem('currentStep', (current + 1).toString());
      localStorage.setItem('parameters', JSON.stringify(this.commandTypes));
    }
  }

  showGoForward(): string {
    if (localStorage.getItem('currentStep') === '2') {
      return 'true';
    }
    return 'false';
  }

  // return just the default parameter for the command group
  parseParametersObject(commandGroupData: any): CommandType[] {
    const commandTypeList: CommandType[] = [];
    commandGroupData.CommandTypes.forEach(element => {
        // set default values
        element.IntervalUnits = '500000';
        element.WhileStatus = 0;
        if (!$.isEmptyObject(element.DefaultParameters)) {
        const parameterList: Parameters[] = [];
        const theData = element.DefaultParameters;
        const paramData = JSON.parse(theData);
        for (const paramItem of paramData.Parameters) {
           const param =  {} as Parameters;
           param.commandTypeId = element.Id;
           param.commandTypeName = element.Name;
           param.name = paramItem.Name;
           param.item = {} as ParameterDisplaySettings;
           param.item.dataType = paramItem.DataType;
           param.item.displayName = paramItem.DisplayName;
           param.item.required = paramItem.Required;
           param.item.fieldType = paramItem.FieldType;
           // For lists put the suggested input in the dropdown array
           if (param.item.fieldType === 'List') {
           param.item.dropdown = paramItem.SuggestedInput.split(', ');
           } else {
            param.item.dropdown = [];
            param.item.suggestedInput = paramItem.SuggestedInput;
           }
           param.item.userInstructions = paramItem.UserInstructions;
           param.item.displayOrder = paramItem.DisplayOrder;
           parameterList.push(param);
         }
        element.DefaultParameters = parameterList;
       }
        commandTypeList.push(element);
    });
    localStorage.setItem('parameters', JSON.stringify(commandTypeList));
    return commandTypeList;
  }

  _onIntervalTypeChange(event: any) {
    this.intervalMax = parseInt(event.target.value, 10);
  }

  _onParamOptionsChange(event: any, param: Parameters) {
    param.value = event.target.value;
    localStorage.setItem('parameters', JSON.stringify(this.commandTypes));
  }

  _onInputMouseOut(event: any, param: Parameters) {
    param.value = event.target.value;
    localStorage.setItem('parameters', JSON.stringify(this.commandTypes));
  }

  _onRunUntilDateChanged(event: any) {
    localStorage.setItem('parameters', JSON.stringify(this.commandTypes));
  }

  _onIntervalMouseOut(event: any, commandType: CommandType) {
    commandType.Interval = event.target.value;
    localStorage.setItem('parameters', JSON.stringify(this.commandTypes));
  }

  _onExWeekendesChange(event: any, commandType: CommandType) {
    if (event.target.value === 'on') {
      commandType.ExcludeWeekends = true;
    } else {
      commandType.ExcludeWeekends = false;
    }
    localStorage.setItem('parameters', JSON.stringify(this.commandTypes));
  }

  _onCoreHoursChange(event: any, commandType: CommandType) {
    if (event.target.value === 'on') {
      commandType.CoreHoursOnly = true;
    } else {
      commandType.ExcludeWeekends = false;
    }
    localStorage.setItem('parameters', JSON.stringify(this.commandTypes));
  }

  _onStatusChange(event: any, commandType: CommandType) {
    commandType.WhileStatus = event.target.value;
    localStorage.setItem('parameters', JSON.stringify(this.commandTypes));
  }
}

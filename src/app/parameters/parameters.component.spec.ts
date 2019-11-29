import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ParametersComponent } from './parameters.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ParametersService } from '../services/parameters/parameters.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

class MockSrv {
  getCommandGroupParameters(){
    return data;
  }
}

const data = {
  Id: 1,
  Name: 'TestGroup',
  CommandTypes: [
      {
          Id: 12,
          GroupMembershipId: 18,
          Name: 'CommandTypeName1',
          DefaultParameters: JSON.stringify({
            Parameters: [
              {	
                "Name": "ParamName",
                "DisplayName": "Param Name",
                "SuggestedInput": "enter this",
                "FieldType": "ShortString",
                "DataType": "String",
                "Required": "True",
                "DisplayOrder": "1",
                "UserInstruction": "Enter something useful"
              },
              {
                "Name": "ParamName2",
                "DisplayName": "Param Name 2",
                "SuggestedInput": "enter this",
                "FieldType": "LongString",
                "DataType": "List",
                "Required": "True",
                "DisplayOrder": "2",
                "UserInstruction": "Enter something"
              }
            ]
          })
      },
      {
        Id: 13,
        GroupMembershipId: 19,
        Name: 'CommandTypeName2',
        DefaultParameters: JSON.stringify({
          Parameters: [
            {	
              "Name": "ParamName",
              "DisplayName": "Param Name",
              "SuggestedInput": "enter this",
              "FieldType": "ShortString",
              "DataType": "String",
              "Required": "True",
              "DisplayOrder": "1",
              "UserInstruction": "Enter something useful"
            },
            {
              "Name": "ParamName2",
              "DisplayName": "Param Name 2",
              "SuggestedInput": "enter this",
              "FieldType": "LongString",
              "DataType": "List",
              "Required": "True",
              "DisplayOrder": "2",
              "UserInstruction": "Enter something"
            }
          ]
        })
    }
  ]
};

describe('ParametersComponent', () => {
  let theComponent;
  let theService;
  let spy: any;
  let store = {};

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

    localStorage.setItem('currentStep', '3');
    localStorage.setItem('commandChosen', '{"2": "TestGroup"}');
    localStorage.setItem('parameters', null);

    TestBed.configureTestingModule({
      declarations: [ ParametersComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        BsDatepickerModule.forRoot()
      ],
      providers: [
        ParametersComponent,
        { provide: ParametersService, useClass: MockSrv }
      ]
    });
    theComponent = TestBed.get(ParametersComponent);
    theService = TestBed.get(ParametersService);
 });


  it('should create', () => {
    expect(theComponent).toBeTruthy();
  });

  it('service should be called', () => {
    spy = spyOn(theService, 'getCommandGroupParameters').and.returnValue(of(data));
    spy = spyOn(theComponent, 'parseParametersObject').and.returnValues([]);
    theComponent.getParameters();
    expect(theService.getCommandGroupParameters).toHaveBeenCalled();
  });

  it('component classes called', () => {
    spy = spyOn(theComponent, 'getParameters');
    theComponent.ngOnInit();
    expect(theComponent.getParameters).toHaveBeenCalled();
  });

  it('returns list of parameters', () => {
    const params = theComponent.parseParametersObject(data);
    expect(params.length).toEqual(2);
  });

  it('elements should be disabled when current step is 3', () => {
    spy = spyOn(theComponent, 'getParameters');
    theComponent.ngOnInit();
    const disableElements = theComponent.disableElements();
    expect(disableElements).toBe(true);
  });

  it('elements should be enabled when current step is 2', () => {
    localStorage.setItem('currentStep', '2');
    spy = spyOn(theComponent, 'getParameters');
    theComponent.ngOnInit();
    const disableElements = theComponent.disableElements();
    expect(disableElements).toBe(false);
  });

});

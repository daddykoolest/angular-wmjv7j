import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ParametersService } from './parameters.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';


describe('ParametersService', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let parametersService: ParametersService;

  beforeEach(() => {
  TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [HttpClient]
    })
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    parametersService = new ParametersService(<any> httpClientSpy);
  });

  it('should be created', () => {
    const service: ParametersService = TestBed.get(ParametersService);
    expect(service).toBeTruthy();
  });

  it('should return commandGroup object', () => {
    const commandGroupObject = 
    {
      Id: 1,
      Name: "TestGroup",
      CommandTypes: [
          {
              Id: 12,
              GroupMembershipId: 18,
              Name: "CommandTypeName1",
              DefaultParameters: { "param_name1": "param_value1" }
          },
          {
            Id: 13,
            GroupMembershipId: 19,
            Name: "CommandTypeName2",
            DefaultParameters: { "param_name2": "param_value2" }
        }
      ]
    };

    const paramsObject = { param_name2: "param_value2" };
    
    httpClientSpy.get.and.returnValue(of(commandGroupObject));

    parametersService.getCommandGroupParameters(1).subscribe((response) => {
    expect(response.Name).toEqual('TestGroup');
    expect(response.Id).toEqual(1);
    expect(response.CommandTypes.length).toBe(2);
    expect(response.CommandTypes[1].Name).toEqual('CommandTypeName2');
    expect(response.CommandTypes[1].DefaultParameters).toEqual(paramsObject);
    });

    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  })

  
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommandsComponent } from './commands.component';
import { CommandService } from '../services/commands/command.service';
import { ToastService } from "../services/toast/toast.service";
import { HttpErrorResponse } from '@angular/common/http';
import { CommandGroup } from '../objects/commandGroup';
import { of } from 'rxjs';

const data = CommandGroup;

class MockSrv {
  private API_URL = 'http://test/';

  private commandsUrl = this.API_URL + 'api/commandgroup/';

  getAllCommandGroups() {
    return data;
  }

  handleError() {
    return HttpErrorResponse;
  }
}

class MockToaster {
  showError() {
    return 'toast';
  }
}

describe('CommandsComponent', () => {
  let spy: any;
  let theComponent: CommandsComponent;
  let theService: { getAllCommandGroups: any; };

  let store = {};

  beforeEach(() => {

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
      imports: [HttpClientTestingModule],
      declarations: [CommandsComponent],
      providers: [
        CommandsComponent,
        { provide: CommandService, useClass: MockSrv },
        { provide: ToastService, useClass: MockToaster }
      ]
    });

    theComponent = TestBed.get(CommandsComponent);
    theService = TestBed.get(CommandService);

  });

  it('should create', () => {
    expect(theComponent).toBeTruthy();
  });

  it('get commands should be called', () => {
    spy = spyOn(theComponent, 'getCommands');
    theComponent.ngOnInit();
    expect(theComponent.getCommands).toHaveBeenCalled();
  });

  it('commands service is called', () => {
    spy = spyOn(theService, 'getAllCommandGroups').and.returnValue(of(data));
    theComponent.getCommands();
    expect(theService.getAllCommandGroups).toHaveBeenCalled();
  });

  it('sets all local storage values as expected when continuing', () => {
    spy = spyOn(theService, 'getAllCommandGroups').and.returnValue(of(data));
    localStorage.setItem('parameters', 'Some text');
    localStorage.setItem('minionChosen', '5');
    theComponent.chooseCommand('3', 'TestCommand');
    expect(Object.keys(store).length).toBe(2);
    expect(store['parameters']).toBeUndefined();
    expect(store['minionChosen']).toBeUndefined();
    expect(store['commandChosen']).toBe('{"3":"TestCommand"}');
    expect(store['commandStarted']).toBe('true');
  });

});

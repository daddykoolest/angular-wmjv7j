import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MinionsComponent } from './minions.component';
import { MinionService } from '../services/minion/minion.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from 'selenium-webdriver/http';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbPopoverModule, NgbModule  } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

const data = {
    MinionId: 1,
    SiteId: 'TestId',
    SiteName: 'TestName',
    ServerName: 'Server Name',
    Status: 'Red',
    OperatingSystem: 'Windows 10',
    MinionVersion: '0.9.0.7'
};

class MockSrv {
  private API_URL = 'http://test/';

  private commandsUrl = this.API_URL + 'api/minion/all';

  private http = new HttpClient(this.commandsUrl);

  getAllMinions(params: any) {
    return data;
  }
}

describe('MinionsComponent', () => {
  let theComponent;
  let theService;
  let theFixture;
  let spy: any;
  let router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, RouterTestingModule, NgbModule],
      declarations: [MinionsComponent],
      providers: [
        MinionsComponent,
        { provide: MinionService, useClass: MockSrv },
        { provide: Router, useValue: {
          url: '/create-command'
        } }
      ]
    });
    theFixture = TestBed.createComponent(MinionsComponent);
    theComponent = theFixture.componentInstance;
    theService = TestBed.get(MinionService);
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(theComponent).toBeTruthy();
  });

  it('component classes called', () => {
    spy = spyOn(theComponent, 'getMinions');
    theComponent.ngOnInit();
    expect(theComponent.getMinions).toHaveBeenCalled();
  });

  it('sort options should be set', () => {
    spy = spyOn(theComponent, 'setSortOptions');
    theComponent.ngAfterViewChecked();
    expect(theComponent.setSortOptions).toHaveBeenCalled();
  });

  it('selected minions highlighted', () => {
    spy = spyOn(theComponent, 'showSelected');
    theComponent.ngAfterViewChecked();
    expect(theComponent.showSelected).toHaveBeenCalled();
  });

  it('remove filters calls minions service', () => {
    spy = spyOn(theService, 'getAllMinions').and.returnValue(of(data));
    theComponent.removeFilter();
    expect(theService.getAllMinions).toHaveBeenCalled();
  });

  it('service should be called when no filters are set', () => {
    spy = spyOn(theService, 'getAllMinions').and.returnValue(of(data));
    theComponent.getMinions(null, null, null);
    expect(theService.getAllMinions).toHaveBeenCalled();
  });

  it('service should be called when filters are set', () => {
    spy = spyOn(theService, 'getAllMinions').and.returnValue(of(data));
    theComponent.getMinions('test', 'value', null);
    expect(theService.getAllMinions).toHaveBeenCalled();
  });

  it('service should be called when filters and sort options are set', () => {
    spy = spyOn(theService, 'getAllMinions').and.returnValue(of(data));
    theComponent.getMinions('filtername', 'filtervalue', 'sortvalue');
    expect(theService.getAllMinions).toHaveBeenCalled();
  });

  it('service should be called when filters and sort options are set and filter name is status', () => {
    spy = spyOn(theService, 'getAllMinions').and.returnValue(of(data));
    theComponent.getMinions('status', 'red', 'sortvalue');
    expect(theService.getAllMinions).toHaveBeenCalled();
  });

  it('toggle grid true should show grid', () => {
    theComponent.toggleMinionGrid(true);
    expect(theComponent.minionsDisplayGrid).toBeTruthy();
  });

  it('toggle grid false should hide grid', () => {
    theComponent.toggleMinionGrid(false);
    expect(theComponent.minionsDisplayGrid).toBeFalsy();
  });

  it('toggle minions should select all', () => {
    theComponent.minionsAllSelected = false;
    theComponent.minions = [];
    theComponent.minions.push(data);
    theComponent.toggleMinions();
    expect(theComponent.minionsAllSelected).toBeTruthy();
  });

  it('toggle minions should deselect all', () => {
    theComponent.minionsAllSelected = true;
    theComponent.minions = [];
    theComponent.minions.push(data);
    theComponent.toggleMinions();
    expect(theComponent.minionsAllSelected).toBeFalsy();
  });

  it('toggle minion should increase number of minions selected', () => {
    theComponent.currentMinions = {};
    theComponent.noMinionsSelected = 0;
    theComponent.toggleMinion('minionID', 'minionName');
    expect(theComponent.noMinionsSelected).toEqual(1);
  });

});

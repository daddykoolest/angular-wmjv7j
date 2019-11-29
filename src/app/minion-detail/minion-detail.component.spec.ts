import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MinionDetailComponent } from './minion-detail.component';
import { MinionService } from '../services/minion/minion.service';
import { HttpClient } from 'selenium-webdriver/http';
import { of, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

class MockSrv {
  private API_URL = 'http://test/';

  private commandsUrl = this.API_URL + 'api/minion/';

  private http = new HttpClient(this.commandsUrl);

  getMinionDetails(id: number): Observable<any> {
    return new Observable();
  }

  handleError() {
    return HttpErrorResponse;
  }
}

const data = {
    MinionId: 1,
    SiteId: 'TestId',
    SiteName: 'TestName',
    ServerName: 'Server Name',
    Status: 'Red',
    OperatingSystem: 'Windows 10',
    MinionVersion: '0.9.0.7',
};

describe('MinionDetailComponent', () => {
  let theComponent;
  let theService;
  let spy: any;

  let fixture: ComponentFixture<MinionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule],
      declarations: [MinionDetailComponent],
      providers: [
        MinionDetailComponent,
        { provide: MinionService, useClass: MockSrv }
      ]
    });

    theComponent = TestBed.get(MinionDetailComponent);
    theService = TestBed.get(MinionService);
  });

  it('should create', () => {
    expect(theComponent).toBeTruthy();
  });

  it('service should be called', () => {
    spy = spyOn(theService, 'getMinionDetails').and.returnValue(of(data));
    theComponent.getMinionDetails();
    expect(theService.getMinionDetails).toHaveBeenCalled();
  });
});

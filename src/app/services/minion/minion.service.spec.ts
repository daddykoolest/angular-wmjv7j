import { TestBed, getTestBed } from '@angular/core/testing';
import { MinionService } from './minion.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MinionDetail } from 'src/app/objects/minionDetail';

describe('MinionService', () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let minionService: MinionService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [HttpClient]
    });
    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
    minionService = injector.get(MinionService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const service: MinionService = TestBed.get(MinionService);
    expect(service).toBeTruthy();
  });

  it('should hit the API', () => {
    const returnToken = 'value';

    minionService.getMinionSummary().subscribe(
        resp => expect(resp).toEqual(returnToken, 'returned token'),
        fail
    );

    const req = httpMock.expectOne(environment.API_URL + 'api/minion/summary');
    expect(req.request.method).toBe('GET');
    req.flush(returnToken);
  });

  it('get all minions should hit the API', () => {
    const returnToken = [];

    minionService.getAllMinions('').subscribe(
        resp => expect(resp).toEqual(returnToken, []),
        fail
    );

    const req = httpMock.expectOne(environment.API_URL + 'api/minion/all');
    expect(req.request.method).toBe('GET');
    req.flush(returnToken);
  });

  it('search minions should hit the API', () => {
    const returnToken = [];

    minionService.searchMinions('test').subscribe(
        resp => expect(resp).toEqual(returnToken, []),
        fail
    );

    const req = httpMock.expectOne(environment.API_URL + 'api/minion/all/?searchTerm=test');
    expect(req.request.method).toBe('GET');
    req.flush(returnToken);
  });

  it('search minions with empty string should not hit the API', () => {
    const returnToken = [];

    minionService.searchMinions('').subscribe(
        resp => expect(resp).toEqual(returnToken, []),
        fail
    );

    const req = httpMock.expectNone(environment.API_URL + 'api/minion/all/?searchTerm=test');
    expect(req).toBeUndefined();
  });
});

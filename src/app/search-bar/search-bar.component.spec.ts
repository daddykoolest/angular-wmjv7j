import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MinionService } from '../services/minion/minion.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const data = {
  MinionId: 1,
  SiteId: 'TestId',
  SiteName: 'TestName',
  ServerName: 'Server Name',
  Status: 'Red',
  OperatingSystem: 'Windows 10',
  MinionVersion: '0.9.0.7',
};

describe('SearchBarComponent', () => {
  let theComponent;
  let theService;
  let theFixture;
  let spy: any;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [ SearchBarComponent ],
      providers: [
        SearchBarComponent
      ]
    });

    theFixture = TestBed.createComponent(SearchBarComponent);
    theComponent = theFixture.componentInstance;
    theService = TestBed.get(MinionService);
  });

  it('should create', () => {
    expect(theComponent).toBeTruthy();
  });

  it('search method should be called on input', () => {
    spy = spyOn(theComponent, 'search');
    const searchElement: HTMLElement = theFixture.nativeElement;
    const searchInput = searchElement.querySelector('input');
    searchInput.value = 'test';
    searchInput.dispatchEvent(new Event('input'));
    theFixture.detectChanges();
    expect(theComponent.search).toHaveBeenCalled();
  });

});

import { TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';

describe('HomeComponent', () => {
  let component: HomeComponent;

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
      imports: [HttpClientModule],
      declarations: [HomeComponent],
      providers: [HomeComponent]
    });

    component = TestBed.get(HomeComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove all filters and remove the "next" button for minions when viewing all', () => {
    localStorage.setItem('currentStep', '2');
    localStorage.setItem('searchFilters', '[{"filterName":"status","filterValue":"Red"}]');
    component.setTotal();
    expect(store.['currentStep']).toBeUndefined();
    expect(store.['searchFilters']).toBeUndefined();
  });

  it('should add a filter and remove the "next" button for minions when searching for amber', () => {
    localStorage.setItem('currentStep', '2');
    component.setAmber();
    expect(store.['currentStep']).toBeUndefined();
    expect(store.['searchFilters']).toBe('[{"filterName":"status","filterValue":"Amber"}]');
  });

  it('should add a filter and remove the "next" button for minions when searching for red', () => {
    localStorage.setItem('currentStep', '2');
    component.setRed();
    expect(store.['currentStep']).toBeUndefined();
    expect(store.['searchFilters']).toBe('[{"filterName":"status","filterValue":"Red"}]');
  });
});

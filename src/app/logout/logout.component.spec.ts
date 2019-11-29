import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';

import { LogoutComponent } from './logout.component';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let theService: UserService;

  it('should create', () => {
    let mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      declarations: [ LogoutComponent],
      providers: [LogoutComponent,
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: theService }
      ]
    })

    component = TestBed.get(LogoutComponent);

    expect(component).toBeTruthy();
  });

  it('should logout to login page', () => {

    let mockRouter = {
      url: '/',
      navigate: jasmine.createSpy('navigate')
    };

    let userService = {
      logout: jasmine.createSpy('logout')
    };

    TestBed.configureTestingModule({
      declarations: [ LogoutComponent],
      providers: [LogoutComponent,
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: userService }
      ]
    })

    component = TestBed.get(LogoutComponent);

    component.ngOnInit();
    component.onLogout();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
  })

  it('should logout from home page', () => {

    let mockRouterLocal = {
      url: 'home',
      navigate: jasmine.createSpy('navigate')
    };

    let userService = {
      logout: jasmine.createSpy('logout')
    };

    TestBed.configureTestingModule({
      declarations: [ LogoutComponent],
      providers: [LogoutComponent,
        { provide: Router, useValue: mockRouterLocal },
        { provide: UserService, useValue: userService }
      ]
    })

    component = TestBed.get(LogoutComponent);

    component.ngOnInit();
    component.onLogout();
    expect(mockRouterLocal.navigate).toHaveBeenCalledWith(['']);
  })

});

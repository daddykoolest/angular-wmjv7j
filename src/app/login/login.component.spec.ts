import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { LoginService } from '../services/login/login.service';
import { of } from 'rxjs';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


class MockSrv {
  private API_URL = 'http://test/';

  private loginUrl = this.API_URL + 'api/user/login';

  private http = new HttpClient(this.loginUrl);

  loginUser() {
    return 'token';
  }

  forgottenPassword() {
    return 'token';
  }

  handleError() {
    return HttpErrorResponse;
  }
}

describe('LoginComponent', () => {

  let theComponent;
  let theService;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      declarations: [LoginComponent],
      providers: [
        LoginComponent,
        { provide: LoginService, useClass: MockSrv },
        { provide: Router, useValue: mockRouter}
      ]
    });

    theComponent = TestBed.get(LoginComponent);
    theService = TestBed.get(LoginService);

  });

  it('login should create', () => {
    expect(theComponent).toBeTruthy();
  });

  it(`login should construct`, () => {
    theComponent.ngOnInit();
    expect(theComponent.validEmail).toBeFalsy();
  });

  it('should append submission email with covetrus address', () => {
    const spy = spyOn(theService, 'loginUser').and.returnValue(of('token'));
    theComponent.ngOnInit();
    theComponent.userlogin.controls.email.setValue('test');
    theComponent.userlogin.controls.password.setValue('password');

    theComponent.onClickSubmit();

    expect(theComponent.validEmail).toBe(true);
    expect(theComponent.validPassword).toBe(true);
    expect(spy.calls.any()).toBeTruthy();
  });

  it('should append submission email with covetrus address', () => {
    const spy = spyOn(theService, 'loginUser').and.returnValue(of('token'));
    theComponent.ngOnInit();
    theComponent.userlogin.controls.email.setValue('test');
    theComponent.userlogin.controls.password.setValue('password');
    theComponent.onClickSubmit();

    expect(theComponent.validEmail).toBe(true);
    expect(theComponent.validPassword).toBe(true);
    expect(spy.calls.any()).toBeTruthy();
  });

  it('should allow non-covetrus emails', () => {
    const spy = spyOn(theService, 'loginUser').and.returnValue(of(''));
    theComponent.ngOnInit();
    theComponent.userlogin.controls.email.setValue('test@test.com');
    theComponent.userlogin.controls.password.setValue( 'password');
    theComponent.onClickSubmit();
    expect(theComponent.userlogin.controls.email.value).toBe('test@test.com');
  });

  it('should allow submission when there is an email and a password', () => {
    const spy = spyOn(theService, 'loginUser').and.returnValue(of(''));
    theComponent.ngOnInit();
    theComponent.userlogin.controls.email.setValue('test');
    theComponent.userlogin.controls.password.setValue('password');
    theComponent.onClickSubmit();
    expect(theComponent.validEmail).toBe(true);
    expect(theComponent.validPassword).toBe(true);
  });

  it('should allow submission when there is an email and a forgotten password', () => {
    spyOn(theService, 'loginUser').and.returnValue(of(''));
    spyOn(theService, 'forgottenPassword').and.returnValue(of(''));
    theComponent.ngOnInit();
    theComponent.userlogin.controls.email.setValue('test');
    theComponent.model.forgotten = true;
    theComponent.onClickSubmit();
    expect(theComponent.submissionAttempted).toBe(true);
  });

  it('should not allow submission without an email', () => {
    const spy = spyOn(theService, 'loginUser').and.returnValue(of(''));
    theComponent.ngOnInit();
    theComponent.userlogin.controls.password.setValue('password');
    theComponent.model.forgotten = true;
    theComponent.onClickSubmit();
    expect(theComponent.validEmail).toBe(false);
  });

  it('should not allow submission with a short password', () => {
    const spy = spyOn(theService, 'loginUser').and.returnValue(of(''));
    theComponent.ngOnInit();
    theComponent.userlogin.controls.email.setValue('test');
    theComponent.userlogin.controls.password.setValue('pass');
    theComponent.onClickSubmit();
    expect(theComponent.validPassword).toBe(false);
  });
});

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LoginService } from './login.service';
import { HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common//http';

describe('LoginService', () => {
  let httpClientSpy: { post: jasmine.Spy};

  let loginService: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [HttpClient]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    loginService = new LoginService(httpClientSpy as any);
  });

  it(`should return token`, () => {
    const returnToken = 'fake token';

    httpClientSpy.post.and.returnValue(of(returnToken));

    loginService.loginUser('test', '123456').subscribe(
        resp => expect(resp).toEqual(returnToken, 'returned token'),
        fail
    );

    expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
  });

  it(`should return an error when the server returns s 401`, () => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 401 error',
      status: 401, statusText: 'Not Found'
    });

    httpClientSpy.post.and.returnValue(of(errorResponse));

    loginService.loginUser('test', '123456')
      .subscribe(
        resp => fail('expected error here'),
        error => expect(error.message).toContain('test 401 error')
    );
  });

  it('should be created', () => {
    const service: LoginService = TestBed.get(LoginService);
    expect(service).toBeTruthy();
  });
});

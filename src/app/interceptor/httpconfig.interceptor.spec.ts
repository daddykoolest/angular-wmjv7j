import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { HttpConfigInterceptor } from './httpconfig.interceptor';
import { CommandService } from '../services/commands/command.service';
import { LoginService } from "../services/login/login.service";
import { environment } from '../../environments/environment';

describe('HttpConfigInterceptor', () => {
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;
    let commandService: CommandService;
    let loginService: LoginService;
  
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                LoginService,
                CommandService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: HttpConfigInterceptor, 
                    multi: true
                }
            ]
          });
    
          httpMock = TestBed.get(HttpTestingController);
          httpClient = TestBed.get(HttpClient);
          localStorage.setItem('token', 'theToken');
    });

    afterEach(() => {
        localStorage.removeItem('token');
    });
  
    it('should add content type and auth header for command service', () => {
        commandService = TestBed.get(CommandService);
        commandService.getAllCommandGroups().subscribe(response => {
            expect(response).toBeTruthy();
        });
        const theBaseUrl  = environment.API_URL;
        const theUrl = theBaseUrl + 'api/commandgroup/all'
        const httpRequest = httpMock.expectOne(theUrl);
        expect(httpRequest.request.headers.has('Content-Type')).toEqual(true);
        expect(httpRequest.request.headers.has('X-SMART-Auth')).toEqual(true);
    });
    
    it('should add content type but no auth header for login service', () => {
        loginService = TestBed.get(LoginService);

        loginService.loginUser('username', 'password').subscribe(response => {
            expect(response).toBeTruthy();
        });
        const theBaseUrl  = environment.API_URL;
        const theUrl = theBaseUrl + 'api/user/login'
        const httpRequest = httpMock.expectOne(theUrl);
        expect(httpRequest.request.headers.has('Content-Type')).toEqual(true);
        expect(httpRequest.request.headers.has('X-SMART-Auth')).toEqual(false);
    });
});
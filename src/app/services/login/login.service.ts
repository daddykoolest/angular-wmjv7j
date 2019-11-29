import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

const httpOptions = {
  responseType: 'text' as 'json'
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private API_URL = environment.API_URL;

  private loginUrl = this.API_URL + 'api/user/login';
  private forgotten = this.API_URL + 'api/user/forgot-password';


  constructor(
    private http: HttpClient) { }

  loginUser(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, {username, password}, httpOptions).pipe(
              tap(resp => {
                if (resp instanceof HttpErrorResponse) { throw Error(this.processUnauthorised(resp)); }
                if (resp) {
                  localStorage.setItem('token', JSON.stringify(resp));
                }
                return resp;
              })
            );
  }

  private processUnauthorised(error: HttpErrorResponse) {
      const errMsg = (error.error) ? error.error : 'Server error';
      if (error.status !== 401 ) {
          window.location.href = '/';
      }
      return errMsg;
  }

  forgottenPassword(email: string): Observable<any> {
    return this.http.post(this.forgotten, {Email: email}, httpOptions).pipe(
      tap(resp => {
        if (resp instanceof HttpErrorResponse) { throw Error(this.processUnauthorised(resp)); }
        return resp;
      })
    );

  }
}

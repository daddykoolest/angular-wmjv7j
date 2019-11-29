import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const httpOptions = {
  responseType: 'text' as 'json'
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.API_URL;
  private resetPasswordUrl = this.API_URL + 'api/user/update';
  private idFromTokenUrl = this.API_URL + 'api/user/token';
  private userUrl = this.API_URL + 'api/user';
  private jwToken: any;
  private request = {
    Id: null,
    FirstName: null,
    Surname: null,
    Mobile: null,
    Password: null,
    OldPassword: null
  };
  private newUserUrl = this.API_URL + 'api/user/new';
  private jwtHelper = new JwtHelperService();
  constructor(private http: HttpClient) { }

  getToken() {
    this.jwToken = this.jwtHelper.decodeToken(localStorage.getItem('token'));
  }

  async resetPassword(newPassword: string, repeated: string, token: string) {
    if (newPassword !== repeated) {
      return false;
    }

    let userId = -1;
    try {
      userId = await this.userIdFromPasswordResetToken(token);
      const body = {Id: userId, Password: newPassword};
      const response = await this.http.put<any>(this.resetPasswordUrl + '/' + token, body, {observe: 'response'}).toPromise();
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async userIdFromPasswordResetToken(token: string): Promise<number> {
    const result = await this.http.get<string>(this.idFromTokenUrl + '/' + token).toPromise();
    return parseInt(result);
  }

  userDetails(): Observable<any> {
    this.getToken();
    const result = this.http.get<string>(this.userUrl + '/' + this.jwToken.userId + '/details');
    return result.pipe();
  }

  logout() {
    this.jwToken = null;
  }

  async updateUser(firstName: string, lastName: string, mobileNumber: string) {
    this.getToken();
    if (firstName != null || lastName != null || mobileNumber != null) {
      this.request.Id = this.jwToken.userId;
      this.request.FirstName = firstName;
      this.request.Surname = lastName;
      this.request.Mobile = mobileNumber;
      return await this.http.put<any>(this.resetPasswordUrl + '/me', JSON.stringify(this.request), {observe: 'response'}).toPromise();
    }
    return new HttpResponse({status: 500});
  }

  async updateUserPassword(oldPassword: string, newPassword: string, confirmPassword: string) {
    this.getToken();
    if (newPassword === confirmPassword && confirmPassword.length > 0 && oldPassword != null && oldPassword !== '') {
      try {
        this.request.Id = this.jwToken.userId;
        this.request.OldPassword = oldPassword;
        this.request.Password = newPassword;
        return await this.http.put<any>(this.resetPasswordUrl + '/me', JSON.stringify(this.request), {observe: 'response'}).toPromise();
      } catch (error) {
        return new HttpResponse({status: 500});
      }
    }
    return new HttpResponse({status: 500});
  }

  createNewUser(newUser: object): Observable<any> {
    const body = newUser;

    return this.http.post(this.newUserUrl, body, httpOptions).pipe(
      tap(resp => {
        if (resp instanceof HttpErrorResponse) {
           throw Error(this.processCreateUserError(resp));
          }
        return resp;
      })
    );
  }

  private processCreateUserError(error: HttpErrorResponse) {
    const errMsg = (error.error) ? error.error : 'Server error';
    if (error.status !== 401 ) {
        window.location.href = '/';
    }
    return errMsg;
}
}

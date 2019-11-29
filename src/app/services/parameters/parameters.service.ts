import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {

  private API_URL = environment.API_URL;
  private paramsUrl = this.API_URL + 'api/commandgroup/';

  constructor(
    private http: HttpClient) { }

  getCommandGroupParameters(commandGroupId: number): Observable<any> {
    return this.http.get<any>(this.paramsUrl + commandGroupId);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  private API_URL = environment.API_URL;

  private commandGroupUrl = this.API_URL + 'api/commandgroup/';

  constructor(
    private http: HttpClient) { }

  getAllCommandGroups(): Observable<any> {
    const theUrl = this.commandGroupUrl + 'all';
    return this.http.get<any>(theUrl, {observe: 'response'}).pipe(map(response => { return response;}));
  }
}

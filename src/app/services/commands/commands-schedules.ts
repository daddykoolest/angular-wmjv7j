import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CommandSchedule } from 'src/app/objects/commandSchedule';

const httpOptions = {
  responseType: 'text' as 'json'
};

@Injectable({
  providedIn: 'root'
})
export class CommandScheduleService {

  private API_URL = environment.API_URL;

  private apiUrl = this.API_URL + 'api/scheduler/';

  constructor(private http: HttpClient) { }


  getAllSchedules(): Observable<CommandSchedule[]> {
    return this.http.get<CommandSchedule[]>(this.apiUrl + 'all?' + 'enabled=true');
  }


  }


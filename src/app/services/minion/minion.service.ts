import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MinionDetail, MinionGroup, EditMinionDetails } from 'src/app/objects/minionDetail';

const httpOptions = {
  responseType: 'text' as 'json'
};

@Injectable({
  providedIn: 'root'
})
export class MinionService {

  private API_URL = environment.API_URL;

  private apiUrl = this.API_URL + 'api/minion/';
  private subscriptionApiUrl = this.API_URL + 'api/mobile/';

  constructor(private http: HttpClient) { }

  getMinionSummary(): Observable<any> {
    return this.http.get(this.apiUrl + 'summary', httpOptions);
  }

  getMinionDetails(minionId: number): Observable<MinionDetail> {
    return this.http.get<MinionDetail>(this.apiUrl + minionId).pipe( );
  }

  getAllMinions(queryParams): Observable<MinionDetail[]> {
    return this.http.get<MinionDetail[]>(this.apiUrl + 'all' + queryParams);
  }

  searchMinions(searchTerm: string): Observable<MinionDetail[]> {
    if (!searchTerm.trim()) {
      return of([]);
    }
    return this.http.get<MinionDetail[]>(this.apiUrl + 'all/?searchTerm=' + searchTerm);
  }

  createMinionGroup(minionList: MinionGroup): Observable<any> {
    return this.http.post(this.apiUrl + 'creategroup', minionList, httpOptions);
  }

  async editMinion(minionDetail: EditMinionDetails, minionId: number) {
    try {
      await this.http.post<any>(this.subscriptionApiUrl + 'subscription/amount/' + minionDetail.SiteId + '/' +
      minionDetail.MobileSubscriptions, null, httpOptions).toPromise();
      return await this.http.put<any>(this.apiUrl + minionId.toString() + '/edit', minionDetail, {observe: 'response'}).toPromise();
    } catch (error) {
      return new HttpResponse({status: 500});
    }
  }
}


import { Component, OnInit, OnDestroy } from '@angular/core';
import { MinionService } from '../services/minion/minion.service';
import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  intval: any;
  constructor(private minionSummary: MinionService) { }

  summary = {TotalMinions: null, MinionsOnRed: null, MinionsOnAmber: null};

  ngOnInit() {
    this.intval = interval(5000).pipe(startWith(0), switchMap(() => this.minionSummary.getMinionSummary()))
    .subscribe((response: any) => { this.summary = JSON.parse(response); });

  }

  ngOnDestroy() {
    if (this.intval) {
       this.intval.unsubscribe();
    }
  }

setTotal(): void {
    localStorage.removeItem('currentStep');
    localStorage.removeItem('searchFilters');
  }

  setRed(): void {
    localStorage.removeItem('currentStep');
    localStorage.setItem('searchFilters', '[{"filterName":"status","filterValue":"Red"}]');
  }

setAmber(): void {
    localStorage.removeItem('currentStep');
    localStorage.setItem('searchFilters', '[{"filterName":"status","filterValue":"Amber"}]');
  }

}

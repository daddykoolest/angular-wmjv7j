import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { MinionService } from '../services/minion/minion.service';
import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  providers: [NgbCarouselConfig]
})

export class CarouselComponent implements OnInit {
  intval: any;
  showNavigationArrows = true;
  showNavigationIndicators = true;

  constructor(private minionSummary: MinionService, config: NgbCarouselConfig) {
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

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

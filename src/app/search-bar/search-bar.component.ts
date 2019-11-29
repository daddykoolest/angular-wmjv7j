import { Component, OnInit, Input, NgModule } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MinionDetail } from '../objects/minionDetail';
import { MinionService } from '../services/minion/minion.service';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})

@NgModule({
  declarations: [NavigationComponent]
})

export class SearchBarComponent implements OnInit {
  public loading;
  minions$: Observable<MinionDetail[]>;
  private searchTerms = new Subject<string>();

  constructor(private minionService: MinionService) { }

  search(searchTerm: string): void {
    this.searchTerms.next(searchTerm);
  }

  ngOnInit() {
    this.minions$ = this.searchTerms.pipe(

      // wait 200ms after each keystroke
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => this.minionService.searchMinions(searchTerm))
    );
  }

  ngOnDestroy() {
    if (this.searchTerms) {
      this.searchTerms.unsubscribe();
    }
  }

}



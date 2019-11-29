import { Component, OnInit, ElementRef, HostListener, ViewChild  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbTableDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  implements OnInit  {
  name = 'Angular';
 @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;

  headTitles = ['Status', 'Date', 'Commands', 'Minions'];
  headElements = ['CombinedStatus', 'ScheduleDate', 'CommandGroupName', 'MinionList'];

  searchText = ' ';
  previous: string;

  banana: any;
  rowCount: any;
  schedules: any;

constructor() {

    this.schedules = [
      {CombinedStatus: 'running', ScheduleDate: '25-09-2019 03:37 PM', CommandGroupName: 'LoopbackTest', MinionList: 'QA2-Master, QA, RAPPORTTEST'},
      {CombinedStatus: 'running', ScheduleDate: '15-11-2019 04:38 PM', CommandGroupName: 'Updater', MinionList: 'QA-SLAVE'},
      {CombinedStatus: 'finished', ScheduleDate: '25-10-2019 08:14 PM', CommandGroupName: 'VLVersion', MinionList: 'RAPPORTEST'},
      {CombinedStatus: 'running', ScheduleDate: '15-09-2019 09:22 PM', CommandGroupName: 'VLStop', MinionList: 'RVBuild, RVTEST, QA-Master, QA, RAPPORTTEST, QA-SLAVE'},
      {CombinedStatus: 'running', ScheduleDate: '26-09-2019 13:32 PM', CommandGroupName: 'VLStatus', MinionList: 'RVTEST'},
      {CombinedStatus: 'running', ScheduleDate: '28-09-2019 15:45 PM', CommandGroupName: 'Updater', MinionList: 'QA-SLAVE'},
      {CombinedStatus: 'finished', ScheduleDate: '25-09-2019 03:37 PM', CommandGroupName: 'LoopbackTest', MinionList: 'QA2-Master, QA, RAPPORTTEST'},
      {CombinedStatus: 'running', ScheduleDate: '15-11-2019 04:38 PM', CommandGroupName: 'Updater', MinionList: 'QA-SLAVE'},
      {CombinedStatus: 'running', ScheduleDate: '25-10-2019 08:14 PM', CommandGroupName: 'VLVersion', MinionList: 'RAPPORTEST'},
      {CombinedStatus: 'finished', ScheduleDate: '15-09-2019 09:22 PM', CommandGroupName: 'VLStop', MinionList: 'RVBuild, RVTEST, QA-Master, QA, RAPPORTTEST, QA-SLAVE'},
      {CombinedStatus: 'running', ScheduleDate: '26-09-2019 13:32 PM', CommandGroupName: 'VLStatus', MinionList: 'RVTEST'},
      {CombinedStatus: 'running', ScheduleDate: '28-09-2019 15:45 PM', CommandGroupName: 'Updater', MinionList: 'QA-SLAVE'},
      {CombinedStatus: 'running', ScheduleDate: '25-09-2019 03:37 PM', CommandGroupName: 'LoopbackTest', MinionList: 'QA2-Master, QA, RAPPORTTEST'},
      {CombinedStatus: 'finished', ScheduleDate: '15-11-2019 04:38 PM', CommandGroupName: 'Updater', MinionList: 'QA-SLAVE'},
      {CombinedStatus: 'running', ScheduleDate: '25-10-2019 08:14 PM', CommandGroupName: 'VLVersion', MinionList: 'RAPPORTEST'},
      {CombinedStatus: 'never', ScheduleDate: '15-09-2019 09:22 PM', CommandGroupName: 'VLStop', MinionList: 'RVBuild, RVTEST, QA-Master, QA, RAPPORTTEST, QA-SLAVE'},
      {CombinedStatus: 'finished', ScheduleDate: '26-09-2019 13:32 PM', CommandGroupName: 'VLStatus', MinionList: 'RVTEST'},
      {CombinedStatus: 'running', ScheduleDate: '28-09-2019 15:45 PM', CommandGroupName: 'Updater', MinionList: 'QA-SLAVE'},
      {CombinedStatus: 'never', ScheduleDate: '25-09-2019 03:37 PM', CommandGroupName: 'LoopbackTest', MinionList: 'QA2-Master, QA, RAPPORTTEST'},
      {CombinedStatus: 'running', ScheduleDate: '15-11-2019 04:38 PM', CommandGroupName: 'Updater', MinionList: 'QA-SLAVE'},
      {CombinedStatus: 'running', ScheduleDate: '25-10-2019 08:14 PM', CommandGroupName: 'VLVersion', MinionList: 'RAPPORTEST'},
      {CombinedStatus: 'never', ScheduleDate: '15-09-2019 09:22 PM', CommandGroupName: 'VLStop', MinionList: 'RVBuild, RVTEST, QA-Master, QA, RAPPORTTEST, QA-SLAVE'},
      {CombinedStatus: 'never', ScheduleDate: '26-09-2019 13:32 PM', CommandGroupName: 'VLStatus', MinionList: 'RVTEST'},
      {CombinedStatus: 'running', ScheduleDate: '28-09-2019 15:45 PM', CommandGroupName: 'Updater', MinionList: 'QA-SLAVE'},
      ];

    const rowCount = this.schedules.length;

  }

  // constructor() {}

  @HostListener('input') oninput() {
    this.searchItems();
  }

  ngOnInit() {
        this.mdbTable.setDataSource(this.schedules);
        this.previous = this.mdbTable.getDataSource();
        console.log(this.banana);
        this.rowCount = this.schedules.length;

  }

  searchItems() {
    const prev = this.mdbTable.getDataSource();

    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.schedules = this.mdbTable.getDataSource();
      this.rowCount = this.schedules.length;
    }

    if (this.searchText) {
      this.schedules = this.mdbTable.searchLocalDataByMultipleFields(this.searchText, ['CombinedStatus', 'ScheduleDate', 'CommandGroupName', 'MinionList']);
      this.mdbTable.setDataSource(prev);
      this.rowCount = this.schedules.length;
    }
  }

  goBack() {
    window.history.back();
  }


}

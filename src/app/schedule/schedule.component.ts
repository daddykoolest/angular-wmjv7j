import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommandSchedule } from '../objects/CommandSchedule';
import { CommandScheduleService } from '../services/commands/commands-schedules';
import { MdbTableDirective } from 'angular-bootstrap-md';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';
import { stringify } from 'querystring';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})

export class ScheduleComponent implements OnInit {
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;

  headTitles = ['Status', 'Date / Time', 'Commands', 'Minions'];
  headElements = ['CombinedStatus', 'ScheduleDate', 'CommandGroupName', 'MinionList'];

  searchText = ' ';
  previous: string;

  schedules: CommandSchedule[];
  rowCount: number;

  constructor(private CommandScheduleServices: CommandScheduleService) {}

  @HostListener('input') oninput() {
    this.searchItems();
  }

  ngOnInit() {
        this.getSchedules();
        this.rowCount = this.previous.length;

  }

  searchItems() {
    const prev = this.mdbTable.getDataSource();

    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.schedules = this.mdbTable.getDataSource();
      this.rowCount = this.schedules.length;
    }

    if (this.searchText) {
      this.mdbTable.setDataSource(prev);
      this.schedules = this.mdbTable.searchLocalDataByMultipleFields(this.searchText, this.headElements);
      this.mdbTable.setDataSource(prev);
      this.rowCount = this.schedules.length;
    }
  }

  getSchedules(): void {
    this.CommandScheduleServices.getAllSchedules()
    .subscribe(schedules => this.schedules = schedules,
      (error: any) => { console.log(error); },
      () => {
        this.mdbTable.setDataSource(this.schedules);
        this.previous = this.mdbTable.getDataSource();
        this.rowCount = this.schedules.length;
      }
      );
  }

  goBack() {
    window.history.back();
  }
}

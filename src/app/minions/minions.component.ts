import { Component, OnInit, AfterViewChecked, EventEmitter, Output } from '@angular/core';
import { MinionService } from '../services/minion/minion.service';
import { MinionDetail } from '../objects/minionDetail';
import { Filters, FilterTypes } from '../objects/searchFilters';
import { SortTypeList, SortTypes } from '../objects/sortFilters';
import * as $ from 'jquery';
import { FilterTypeList } from '../objects/searchFilters';
import { Router } from '@angular/router';

@Component({
  selector: 'app-minions',
  templateUrl: './minions.component.html',
  styleUrls: ['./minions.component.css']
})
export class MinionsComponent implements OnInit, AfterViewChecked {

  message: 'Minions selected';

  @Output() messageEvent2 = new EventEmitter<string>();

  sortValueList: SortTypes[];
  filterValueList: FilterTypes[];
  minions: MinionDetail[];

  filters: Array<Filters> = [];
  sortOption: string;
  filterInput: string;
  minionsAllSelected: boolean;
  minionsDisplayGrid: boolean;
  noMinionsSelected: number;
  noMinionsAvailable: number;
  filtersIsCollapsed: boolean;
  nextEnabled: boolean;

  constructor(private minionsService: MinionService, public router: Router) {
  }

  ngOnInit() {
    this.sortValueList = SortTypeList;
    this.filterValueList = FilterTypeList;
    this.sortOption = localStorage.getItem('sortOption');
    this.minionsAllSelected = false;
    this.filtersIsCollapsed = true;
    this.minionsDisplayGrid = localStorage.getItem('minionDisplayAsGrid') === 'true' ? true : false;
    this.getMinions(null, null, null, this.sortOption);
  }

  ngAfterViewChecked() {
    this.setSortOptions();
    this.showSelected();
    if (localStorage.getItem('minionChosen') !== null) {
      this.sendMessage();
    }
  }

  // Get minion list with any filter / sort params
  getMinions(filterDisplayName: string, filterName: string, filterValue: string, sortValue: string): void {

    if (filterName && filterValue || filterName === 'status') {
      this.filters = this.filters || [];
      // get any status options from the checkboxes and save as comma seperated string
      if (filterName === 'status') {
        let statusOptions = '';
        $('input[name=\'statusOption\']:checked').each(function() {
          statusOptions += $(this).val();
          statusOptions += ', ';
        });
        filterValue = statusOptions.slice(0, -1);
      }
      this.filters.push({filterDisplayName, filterName, filterValue});
      localStorage.setItem('searchFilters', JSON.stringify(this.filters));
    }

    if (sortValue) {
      this.sortOption = sortValue;
      localStorage.setItem('sortOption', sortValue);
    }

    this.filters = localStorage.getItem('searchFilters') != null ? JSON.parse(localStorage.getItem('searchFilters')) : [];
    let queryParams = '?sortby=' + this.sortOption;

    if (this.filters) {
      this.filters.forEach(element => {
        queryParams += '&' + element.filterName + '=' + element.filterValue;
      });
    }

    this.minionsService.getAllMinions(queryParams)
    .subscribe(minions => this.minions = minions,
      (error: any) => { console.log(error); },
      () => {
        this.noMinionsAvailable = this.minions.length; });
    this.totalMinionsSelected();
    this.resetFilters(filterName);
  }

  showSelected() {
    if (localStorage.getItem('minionChosen') !== null) {
      const selectedMinions = JSON.parse(localStorage.getItem('minionChosen'));

      Object.keys(selectedMinions).forEach(item => {
        $('#minion-' + item).addClass('selected');
        $('#minionToggle-' + item).text('indeterminate_check_box');
        $('#ico-' + item).text('remove');
      });
    } else {
      if (this.minions !== undefined)  {
        this.minions.forEach(minion => {
          $('[data-minion-id=' + minion.MinionId + ']').removeClass('selected');
          $('#minionToggle-' + minion.MinionId).text('add_box');
          $('#ico-' + minion.MinionId).text('add');
        });
      }
    }
  }

  totalMinionsSelected(): void {
    const selectedMinions = JSON.parse(localStorage.getItem('minionChosen'));
    this.noMinionsSelected = selectedMinions === 'undefined' || selectedMinions === null ? 0 : Object.keys(selectedMinions).length;
  }

  setSortOptions() {
    this.sortOption ? $('#sortSelectList').val(this.sortOption) : $('#sortSelectList').val('sitenameasc');
  }

  // remove one or all filters from local storage
  removeFilter(filterName: string): void {

    if (filterName) {
      this.filters = this.filters.filter(item => item.filterName !== filterName);
      localStorage.setItem('searchFilters', JSON.stringify(this.filters));
      $('option[value=' + filterName + ']').prop('disabled', false);
    } else {
      localStorage.removeItem('searchFilters');
      localStorage.removeItem('sortOption');
      $('option').prop('disabled', false);
      $('#sortSelectList').val('sitenameasc');
    }

    this.getMinions(null, null, null, null);
  }

  // reset filters display so you can add a new filter
  resetFilters(filterName: string): void {
    this.filterInput = null;
    $('option[value=' + filterName + ']').prop('disabled', true);
    $('#filterSelectList').val('0');
    $('input[name=\'statusOption\']').prop('checked', false);
    $('#sortOptionList').hide();
    $('#btnAddFilter').prop('disabled', true);
    $('#filterValueInput').show();
  }

  toggleFilters(): void {
    $('#filtersSection').css('display', 'inline-block');
  }

  // Only enable add btn when filter option selected with a value
  enableAddBtn(): void {
    if (this.filterInput && $('#filterSelectList').val() !== null) {
      $('#btnAddFilter').prop('disabled', false);
    } else {
      if ( $('input[name=\'statusOption\']').is(':checked') ) {
        $('#btnAddFilter').prop('disabled', false);
      }
    }
  }

  // Show status options only when status filter option is selected
  showStatusOptions(filterSelected: string): void {
    if (filterSelected === 'status') {
      $('#sortOptionList').show();
      $('#filterValueInput').hide();
    } else {
      $('#filterValueInput').show();
      $('#sortOptionList').hide();
    }
  }

  goForward(): void {
    const current = parseInt(localStorage.getItem('currentStep'), 10);
    localStorage.setItem('currentStep', (current + 1).toString());
  }

  toggleMinion(id: string, name: string): void {
    if (this.router.url === '/create-command') {
      let currentMinions = new Object();
      // Get list of currently selected minions
      if (localStorage.getItem('minionChosen') !== null) {
      currentMinions = JSON.parse(localStorage.getItem('minionChosen'));
      }
      // Check if minion exists in list and remove if exists
      if (currentMinions !== null && id.toString() in currentMinions) {
        delete currentMinions[id];
        this.noMinionsSelected = Object.keys(currentMinions).length;
        $('[data-minion-id=' + id + ']').removeClass('selected');
        $('#minionToggle-' + id).text('add_box');
        $('#ico-' + id).text('add');
        if (Object.keys(currentMinions).length > 0) {
          localStorage.setItem('minionChosen', JSON.stringify(currentMinions));
        } else {
          localStorage.removeItem('minionChosen');
        }
        this.sendMessage();
        return;
      }
      $('[data-minion-id=' + id + ']').addClass('selected');
      $('#minionToggle-' + id).text('indeterminate_check_box');
      $('#ico-' + id).text('remove');
      currentMinions[id] = name;
      this.noMinionsSelected = Object.keys(currentMinions).length;
      this.sendMessage();
      localStorage.setItem('minionChosen', JSON.stringify(currentMinions));
    } else {
      this.router.navigate(['/minion/' + id]);
    }
  }

  toggleMinions(): void {
    const allMinions = new Object();
    if (!this.minionsAllSelected) {
      // Add all minions to local storage and update DOM
      this.minions.forEach(minion => {
        allMinions[minion.MinionId] = minion.SiteName;
        $('[data-minion-id=' + minion.MinionId + ']').addClass('selected');
        $('#minionToggle-' + minion.MinionId).text('indeterminate_check_box');
        $('#ico-' + minion.MinionId).text('remove');
      });
      localStorage.setItem('minionChosen', JSON.stringify(allMinions));
      this.minionsAllSelected = true;
    } else {
      // Remove all minions from local storage
      localStorage.removeItem('minionChosen');
      // Update DOM
      this.minions.forEach(minion => {
        $('[data-minion-id=' + minion.MinionId + ']').removeClass('selected');
        $('#minionToggle-' + minion.MinionId).text('add_box');
        $('#ico-' + minion.MinionId).text('add');
      });
      this.minionsAllSelected = false;
    }
    this.noMinionsSelected = Object.keys(allMinions).length;
    this.sendMessage();
  }

  sendMessage() {
    if (!this.nextEnabled) {
      this.nextEnabled = true;
    } else {
      if (this.noMinionsSelected === 0) {
        // this.message = 'None';
        this.nextEnabled = false;
      }
    }
    this.messageEvent2.emit(this.message);
  }

  toggleMinionGrid(showAsGrid: boolean): void {
    if (showAsGrid) {
      this.minionsDisplayGrid = true;
      localStorage.setItem('minionDisplayAsGrid', 'true');
      $('#minionResults').hide();
      $('#minionResultsGrid').show();
      $('#viewList').removeClass('selected');
      $('#viewGrid').addClass('selected');
    } else {
      this.minionsDisplayGrid = false;
      localStorage.setItem('minionDisplayAsGrid', 'false');
      $('#minionResults').show();
      $('#minionResultsGrid').hide();
      $('#viewList').addClass('selected');
      $('#viewGrid').removeClass('selected');
    }
  }
}

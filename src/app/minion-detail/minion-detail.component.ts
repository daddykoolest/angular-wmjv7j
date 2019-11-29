import { Component, OnInit, Input } from '@angular/core';
import { MinionService } from '../services/minion/minion.service';
import { MinionDetail, EditMinionDetails } from '../objects/minionDetail';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { Result } from '../objects/result';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-minion-detail',
  templateUrl: './minion-detail.component.html',
  styleUrls: ['./minion-detail.component.css']
})
export class MinionDetailComponent implements OnInit {

  details: MinionDetail;
  editDetails: EditMinionDetails;
  saveResult: Result;

  constructor(
    private minionService: MinionService,
    private route: ActivatedRoute) {
      route.params.subscribe(() => {
        this.getMinionDetails();
      });
    }

  ngOnInit() {
    this.saveResult = new Result();
    $('.alert, #cancel, #save').hide();
  }

  goBack() {
    window.history.back();
  }

  focusSiteId() {
    $('#SiteId').trigger('focus');
  }

  toggleElements(): void {
    $('.site, .mob').prop('disabled', (i, v) => !v);
    $('.toggle').toggle();
  }

  getMinionDetails(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.minionService.getMinionDetails(id).subscribe(response => { this.details = response; });
  }

  editMinionDetails() {
    this.editDetails = {
      SiteId: this.details.SiteId,
      SiteName: this.details.SiteName,
      MobileSubscriptions: this.details.MobileSubscriptions
    };

    this.minionService.editMinion(this.editDetails, this.details.MinionId)
      .then(result => {
        if (result.status === 200) {
          this.saveResult.ResultStatus = true;
          this.saveResult.ResultHeader = 'Success';
          this.saveResult.ResultIcon = 'check';
          this.saveResult.ResultClass = 'alert-success';
          this.saveResult.ResultMessage = 'Changes saved';
        } else {
          this.saveResult.ResultStatus = false;
          this.saveResult.ResultHeader = 'Warning';
          this.saveResult.ResultIcon = 'report_problem';
          this.saveResult.ResultClass = 'alert-danger';
          this.saveResult.ResultMessage = 'Failed';
          this.saveResult.ResultErrors.push('Could not save changes at this time');
        }})
        .catch((err: Error) => {
          this.saveResult.ResultStatus = false;
          this.saveResult.ResultHeader = 'Warning';
          this.saveResult.ResultIcon = 'report_problem';
          this.saveResult.ResultClass = 'alert-danger';
          this.saveResult.ResultMessage = 'Failed to save changes: ' + err.name;
          this.saveResult.ResultErrors.push(err.message);
        })
        .finally(() => { $('.alert').show();  this.getMinionDetails(); } );
  }
}

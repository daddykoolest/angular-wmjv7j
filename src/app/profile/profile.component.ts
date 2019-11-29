import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../services/user/user.service';

enum UserRole {
  Unknown,
  DevOps,
  SupportPlus,
  Support,
  ViewOnly
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  typingTimer: any;
  emailAddress = '';
  role = '';
  personalDetails = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    mobileNumber: new FormControl(),
    oldPassword: new FormControl(),
    newPassword: new FormControl(),
    confirmPassword: new FormControl()
  });
  userDetail = {FirstName: null, Surname: null, Mobile: null};
  saveResult: string;

  constructor(public userService: UserService) { }

  ngOnInit() {
    $('#change-password-collapse').toggle(0);
    $('.email-alert').toggle(0);
    $('.first-name-error').toggle(0);
    $('.last-name-error').toggle(0);
    $('.mobile-number-error').toggle(0);
    $('.access-alert').toggle(0);
    this.userService.userDetails().subscribe((detail: any) => {
      this.userDetail = detail;
      this.emailAddress = detail.Email;
      this.role = UserRole[detail.UserRoleId];
    });
    $('.result-alert').toggle(0);
  }

  firstnameValidate() {
    var re = /^[A-Za-z\s-\']*$/;
    if (this.personalDetails.controls.firstName.value === '' || !re.test(this.personalDetails.controls.firstName.value)) {
      $('#firstName').addClass('error-input');
      $('.first-name-error').show(0);
      if(this.personalDetails.controls.firstName.value === ''){
        $('#first-name-required').show(0);
      } else {
        $('#first-name-required').hide();
      }
      if(!re.test(this.personalDetails.controls.firstName.value)){
        $('#first-name-invalid').show(0);
      } else {
        $('#first-name-invalid').hide();
      }
      this.personalDetails.controls.firstName.setErrors({issue: true});
    } else {
      $('#firstName').removeClass('error-input');
      $('.first-name-error').hide();
      $('#first-name-required').hide();
      $('#first-name-invalid').hide();
      this.personalDetails.controls.firstName.setErrors(null);
    }
  }

  lastnameValidate() {
    var re = /^[A-Za-z\s-\']*$/;
    if (this.personalDetails.controls.lastName.value === '' || !re.test(this.personalDetails.controls.lastName.value)) {
      $('#lastName').addClass('error-input');
      $('.last-name-error').show(0);
      if(this.personalDetails.controls.lastName.value === ''){
        $('#last-name-required').show(0);
      } else {
        $('#last-name-required').hide();
      }
      if(!re.test(this.personalDetails.controls.lastName.value)){
        $('#last-name-invalid').show(0);
      } else {
        $('#last-name-invalid').hide();
      }
      this.personalDetails.controls.lastName.setErrors({issue: true});
    } else {
      $('#lastName').removeClass('error-input');
      $('.last-name-error').hide();

      $('#last-name-required').hide();
      $('#last-name-invalid').hide();
      this.personalDetails.controls.lastName.setErrors(null);
    }
  }

  mobileNumberValidate() {
    if (/^\d*$/.test(this.personalDetails.controls.mobileNumber.value)) {
      $('#mobileNumber').removeClass('error-input');
      $('.mobile-number-error').hide();
      this.personalDetails.controls.mobileNumber.setErrors(null);
    } else {
      $('#mobileNumber').addClass('error-input');
      $('.mobile-number-error').show(0);
      this.personalDetails.controls.mobileNumber.setErrors({issue: true});
    }
  }

  collapseChangePassword() {
    $('#change-password-collapse').toggle(300);
  }

  collapseEmailAlert() {
    $('.email-alert').toggle(300);
  }

  collapseAccessAlert() {
    $('.access-alert').toggle(300);
  }

  triggerUpdate() {
    const req = this.personalDetails.controls;
    console.log(req);
    if (req.firstName.status === 'VALID' && req.lastName.status === 'VALID' && req.mobileNumber.status === 'VALID')
    {
      this.userService.updateUser(req.firstName.value, req.lastName.value, req.mobileNumber.value)
      .then(result => this.saveResult = result.status === 200 ? 'Changes saved.' : 'Could not save changes, try again later.');
      $('.result-alert').toggle(300);
    }
  }

  triggerUpdatePassword() {
    const req = this.personalDetails.controls;
    if (this.validPasswordInputs(req)) {
      this.userService.updateUserPassword(req.oldPassword.value, req.newPassword.value, req.confirmPassword.value)
      .then(result => this.saveResult = result.status === 200 ? 'Password saved.' : 'Could not save changes, try again later.');
      $('.result-alert').show(300);
    }
  }

  validPasswordInputs(req: any): boolean {
    $('.result-alert').hide(0);
    $('#newPassword').removeClass('error-input');
    $('#confirmPassword').removeClass('error-input');
    $('#oldPassword').removeClass('error-input');
    let result = true;

    if (req.confirmPassword.value !== '' && req.confirmPassword.value !== null &&
        req.newPassword.value !== req.confirmPassword.value) {
      this.saveResult = 'Your new password and confirm password do not match.';
      $('.result-alert').show(300);
      $('#confirmPassword').addClass('error-input');
      result = false;
    }

    if (req.confirmPassword.value === '' || req.confirmPassword.value === null) {
      this.saveResult = 'Please confirm your password.';
      $('.result-alert').show(300);
      $('#confirmPassword').addClass('error-input');
      result = false;
    }

    if (req.newPassword.value === '' || req.newPassword.value === null) {
      this.saveResult = 'Please enter your new password.';
      $('.result-alert').show(300);
      $('#newPassword').addClass('error-input');
      result = false;
    }

    if (req.oldPassword.value === '' || req.oldPassword.value === null) {
      this.saveResult = 'Please re-enter your old password.';
      $('.result-alert').show(300);
      $('#oldPassword').addClass('error-input');
      result = false;
    }

    return result;
  }
}



import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as $ from 'jquery';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.css']
})
export class NewUserComponent implements OnInit {

  createUserForm: FormGroup;
  submitted = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createUserForm = this.formBuilder.group({
      FirstName: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s-\']+$')]],
      Surname: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s-\']+$')]],
      Email: ['',[Validators.required, Validators.email]],
      Mobile: [''],
      UserRoleId: ['', Validators.required]
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.createUserForm.controls; }

  createNewUser(){
    this.submitted = true;
    $('#addNewUserButton').prop('disabled', true);
    if(this.createUserForm.invalid){
      // validation handling done in the html
      $('#addNewUserButton').prop('disabled', false);
      return;
    } else {
      this.userService.createNewUser(this.createUserForm.value)
      .subscribe(() => { $('#login-error').text('New user - ' + this.createUserForm.controls.Email.value + ' created')},
      err => {
        $(document).ready(function() {
         
          $('#login-error').text('Error creating new user - ' + err.error); 
        });
      });
    }
  }
}
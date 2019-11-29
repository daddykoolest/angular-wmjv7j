import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from '../services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {
    password: ''
  };
  userlogin = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
      remember: new FormControl(),
      forgotten: new FormControl()
  });
  submissionAttempted = false;
  validEmail = false;
  validPassword = false;

  constructor(
      private loginService: LoginService,
      private router: Router
      ) { }

  ngOnInit() {
      if (localStorage.getItem('token') !== null) {
        this.router.navigate(['']);
      }
  }

  onClickForgotten() {
    $( () => {
        if ($('#inputPassword').is(':visible')) {
            $('#inputPassword').hide('slow');
            $('.input-password-link').hide('slow');
            $('.forgot-password').text('Remembered Password?');
            $('.remember-me-checkbox').hide('slow');
            $('.separator').hide('slow');
            $('.btn-login').text('Send Reminder');
        } else {
            $('#inputPassword').show('slow');
            $('.input-password-link').show('slow');
            $('.forgot-password').text('Forgot Password?');
            $('.remember-me-checkbox').show('slow');
            $('.remember-me-checkbox').show('slow');
            $('.separator').show('slow');
            $('.btn-login').text('Sign In');
        }
    });

    if (this.model.forgotten === 'true') {
        delete this.model.forgotten;
    } else {
        this.model.forgotten = 'true';
    }

   }

    onClickSubmit() {
        let email = this.userlogin.controls.email.value;

        if (this.userlogin.controls.email.value !== null && this.userlogin.controls.email.value.trim() !== '' ) {
            if (this.userlogin.controls.email.value.includes('@')) {
                if (this.userlogin.controls.email.valid) {
                    this.validEmail = true;
                }
            } else {
                email = email + '@covetrus.com';
                this.validEmail = true;
            }

            if (this.model.forgotten != null && this.validEmail) {
                this.loginService.forgottenPassword(email).subscribe(() => {$( () => {
                        $('.login-error').text('An email with instructions to reset your password has been sent to you.'); }
                    ); });
                this.submissionAttempted = true;
                return;
            }

            if (this.userlogin.controls.password.valid) {
                this.validPassword = true;
            } else {
                console.log('password invalid');
            }
        }
        if ((this.validEmail && this.validPassword) || this.submissionAttempted) {
            this.loginService.loginUser(email, this.userlogin.controls.password.value)
            .subscribe( () => { console.log(email + ' logged in');
                                this.router.navigate(['']);
                    },
            err => {
                $( () => {
                $('.login-error').text('Error logging in - ' + err.status + ' ' + err.statusText);
                $('.alert').show();
            }
                );
                }
            );

        } else {
            {$( () => {
                $('.login-error').text('Username or password invalid');
                $('.alert').show();
            }
                ); }
        }
    }
}

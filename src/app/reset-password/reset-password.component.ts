import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  newPassword: string;
  repeatNewPassword: string;
  passwordChangeResult: string;
  token: string;
  resetResult:number;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

  async resetPassword(): Promise<void> {
    if (this.newPassword.length >= 10 && this.repeatNewPassword.length >= 10 ){
      if(this.newPassword === this.repeatNewPassword){
        this.token = this.route.snapshot.paramMap.get('token');
        this.userService.resetPassword(this.newPassword, this.repeatNewPassword, this.token).then(result => 
          this.handleResetReslt(result));
      } else {
        this.passwordChangeResult = "The passwords must match."
      }
    } else {
      this.passwordChangeResult = "The password has to be a minimum of 10 characters."
    }
  }

  handleResetReslt(result): void{
    if (result){
      this.passwordChangeResult = 'Password succefully updated. You will be redirected to the login page.';
      setTimeout(() => {this.router.navigate(['login']);}, 3000);
    } else {
      this.passwordChangeResult = 'There was an error: password was not changed' 
    }
  }
}

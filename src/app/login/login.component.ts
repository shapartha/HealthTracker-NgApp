import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  alertClass: string = "";
  alertText: string = "";
  user: any = {};

  constructor(private appService: AppService) {
    let _loggedInUser = this.appService.getAppUserId;
    if (_loggedInUser != undefined && _loggedInUser != "") {
      this.appService.handleTabChange('home');
    }
  }

  ngOnInit(): void {
    if (this.appService.getAppToken == "") {
      this.appService.invokeTokenCall();
    }
    this.appService.hideLoader(); 
  }

  async submitSignIn(user: any) {
    if (user.email_id != undefined && user.email_id != '' && user.password != undefined && user.password != '') {
      this.appService.showLoader();
      const loginResp = await this.appService.loginUser({ email_id: user.email_id, password: btoa(user.password) });
      if (loginResp.success) {
        this.appService.setAppUserId = loginResp.dataArray[0].user_id;
        this.alertClass = "alert-success";
        this.alertText = "Login Successful ! Redirecting...";
        this.disableButtons();
        setTimeout(() => {
          this.appService.handleTabChange('home');
        }, 1000);
      } else {
        this.alertClass = "alert-danger";
        this.alertText = "Login Credentials Failed";
        this.appService.showAlert(loginResp);
      }
      this.appService.hideLoader();
    } else {
      this.alertClass = "alert-danger";
      this.alertText = "Login Error -> Email ID or Password field cannot be blank";
    }
  }

  disableButtons() {
    document.getElementById("register")!.setAttribute('disabled', 'true');
    document.getElementById("reset")!.setAttribute('disabled', 'true');
  }

  resetForm() {
    this.user.email_id = "";
    this.user.password = "";
  }

  dismissAlert() {
    this.alertText = "";
    this.alertClass = "";
  }

}

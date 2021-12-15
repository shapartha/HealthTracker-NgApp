import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private appService: AppService) { 
    let _loggedInUser = this.appService.getAppUserId;
    if (_loggedInUser == undefined || _loggedInUser == null || _loggedInUser == "") {
      this.appService.handleTabChange('login');
    } else {
      this.appService.eraseCookie("app-user-id-ht");
      this.appService.eraseCookie("app-token-ht");
      setTimeout(() => {
        this.appService.handleTabChange('login');
      }, 3000);
    }
    this.appService.hideLoader();
  }

  ngOnInit(): void {
  }

}

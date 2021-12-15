import { Component, OnInit } from '@angular/core';
import { AppConstant } from 'src/constant/app.const';
import { AppService } from '../app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  appConst = new AppConstant();
  currentTab = "Blood Pressure";

  constructor(public appService: AppService) { }

  ngOnInit(): void {
    this.appService.hideLoader();
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit, OnDestroy {

  passed_data: any;
  desc: any;

  constructor(public appService: AppService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.appService.hideLoader();
    this.passed_data = this.route.data.subscribe(v => {
      this.desc = v;
    });
  }

  ngOnDestroy() {
    this.passed_data.unsubscribe();
  }

}

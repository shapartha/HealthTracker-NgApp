import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { AppConstant } from 'src/constant/app.const';
import { AppService } from '../app.service';

// declare function hideModal(updateModal: string): any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('picker') picker: any;
  @ViewChild('picker2') picker2: any;

  public dt_showSeconds = true;
  public dt_touchUi = true;
  public dt_color: ThemePalette = 'accent';

  appConst = new AppConstant();
  currentTab = "Blood Pressure";
  _hasToggled = false;
  bpData: any = {};
  updateBpData: any = {};
  bpDataList: any[] = [];
  appVersionInfo: string = this.appConst.APP_VERSION;

  constructor(public appService: AppService) { }

  async loadBpData() {
    this.bpData.record_date = new Date();
    const bpDataResp = await this.appService.getBpRecords({ user_id: this.appService.getAppUserId });
    if (bpDataResp.success === true) {
      if (bpDataResp.response === '200') {
        this.bpDataList = bpDataResp.dataArray;
      }
    } else {
      this.appService.showAlert(bpDataResp);
    }
    this.appService.hideLoader();
  }

  ngOnInit(): void {
    this.loadBpData();
  }

  getClassVal(data: any) {
    let finalClassVal = '';
    let goodnessVal = this.appService.calculateBpGoodness(data.systolic, data.diastolic, data.pulse);
    switch (goodnessVal) {
      case 1:
        finalClassVal = 'darkgreen-val';
        break;
      case 0:
        finalClassVal = 'orange-val';
        break;
      default:
        finalClassVal = 'red-val';
    }
    let highLowVal = this.appService.calculateBpHighLow(data.systolic, data.diastolic, data.pulse, goodnessVal);
    switch (highLowVal) {
      case -1:
        finalClassVal += ' bi-check-circle-fill';
        break;
      case 0:
        finalClassVal += ' bi-caret-up-square-fill';
        break;
      default:
        finalClassVal += ' bi-caret-down-square-fill';
    }
    return finalClassVal;
  }

  onAddDataSection(toggleMode: string = 'HIDE') {
    if (toggleMode === 'HIDE' && !this._hasToggled) {
      this.appService.addDataSection(toggleMode);
    } else if (toggleMode === 'SHOW') {
      this._hasToggled = true;
      this.appService.addDataSection(toggleMode);
    } else {
      this._hasToggled = false;
    }
  }

  async submitData() {
    if (this.bpData.sys === undefined || this.bpData.sys === null || this.bpData.dia === undefined ||
      this.bpData.dia === null || this.bpData.pulse === undefined || this.bpData.pulse === null || this.bpData.record_date === undefined || this.bpData.record_date === null) {
      this.appService.showAlert("All the fields are mandatory. Do not leave any field empty or blank.");
      return;
    }
    this.appService.showLoader();
    let inpData = {
      systolic: this.bpData.sys,
      diastolic: this.bpData.dia,
      pulse: this.bpData.pulse,
      check_sum: this.appService.generateUUID(),
      user_id: this.appService.getAppUserId,
      record_date: this.bpData.record_date
    }
    const saveBpResp = await this.appService.saveBpRecord(inpData);
    if (saveBpResp.success === true) {
      this.onAddDataSection('SHOW');
      this.appService.showAlert("Record Added Successfully");
      this.bpData = {};
      this.loadBpData();
    }
    this.appService.hideLoader();
  }

  populateForModal(data: any) {
    this.updateBpData["systolic"] = data.systolic;
    this.updateBpData["diastolic"] = data.diastolic;
    this.updateBpData["pulse"] = data.pulse;
    this.updateBpData["record_date"] = new Date(data.record_date);
    this.updateBpData["check_sum"] = data.check_sum;
    this.updateBpData["user_id"] = this.appService.getAppUserId;
    this.updateBpData["record_id"] = data.record_id;
  }

  async updateData() {
    if (this.updateBpData.systolic === undefined || this.updateBpData.systolic === null || this.updateBpData.diastolic === undefined ||
      this.updateBpData.diastolic === null || this.updateBpData.pulse === undefined || this.updateBpData.pulse === null ||
      this.updateBpData.record_date === undefined || this.updateBpData.record_date === null) {
      this.appService.showAlert("All the fields are mandatory. Do not leave any field empty or blank.");
      return;
    }
    this.updateBpData.record_date = this.appService.convertDateForSQL(this.updateBpData.record_date);
    this.appService.showLoader();
    const updateBpResp = await this.appService.updateBpRecord(this.updateBpData);
    if (updateBpResp.success === true) {
      this.appService.showAlert("Record Updated Successfully");
      let updRecord = this.bpDataList.filter(bp => bp.record_id === this.updateBpData.record_id)[0];
      updRecord.systolic = this.updateBpData.systolic;
      updRecord.diastolic = this.updateBpData.diastolic;
      updRecord.pulse = this.updateBpData.pulse;
      updRecord.record_date = this.updateBpData.record_date;
      this.updateBpData = {};
      var closeBtn = document.getElementById('close-update-btn');
      closeBtn!.click();
    } else {
      this.appService.showAlert(updateBpResp);
    }
    this.appService.hideLoader();
  }

  async deleteData() {
    this.appService.showLoader();
    const deleteBpResp = await this.appService.deleteBpRecord(this.updateBpData);
    if (deleteBpResp.success === true) {
      this.appService.showAlert("Record Deleted Successfully");
      let dltRecordIdx = this.bpDataList.findIndex(bp => bp.record_id === this.updateBpData.record_id);
      this.bpDataList.splice(dltRecordIdx, 1);
      this.updateBpData = {};
      var closeBtn = document.getElementById('close-delete-btn');
      closeBtn!.click();
    } else {
      this.appService.showAlert(deleteBpResp);
    }
    this.appService.hideLoader();
  }
}

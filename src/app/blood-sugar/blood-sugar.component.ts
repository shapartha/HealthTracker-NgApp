import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { AppConstant } from 'src/constant/app.const';
import { AppService } from '../app.service';

@Component({
  selector: 'app-blood-sugar',
  templateUrl: './blood-sugar.component.html',
  styleUrls: ['./blood-sugar.component.scss']
})
export class BloodSugarComponent implements OnInit {

  @ViewChild('picker') picker: any;
  @ViewChild('picker2') picker2: any;
  @ViewChild('pickerA') pickerA: any;
  @ViewChild('pickerA2') pickerA2: any;
  @ViewChild('pickerB') pickerB: any;
  @ViewChild('pickerB2') pickerB2: any;
  public dt_showSeconds = true;
  public dt_touchUi = true;
  public dt_color: ThemePalette = 'accent';

  currentTab = "Blood Sugar";
  appConst = new AppConstant();
  _hasToggled = false;
  bsData: any = {};
  bsDataList: any[] = [];
  updateBsData: any = {};

  constructor(public appService: AppService) { }

  ngOnInit(): void {
    this.loadBsData();
  }

  async loadBsData() {
    this.bsData.record_date_fst = new Date();
    this.bsData.record_date_pp = new Date();
    const bsDataResp = await this.appService.getBsRecords({ user_id: this.appService.getAppUserId });
    if (bsDataResp.success === true) {
      if (bsDataResp.response === '200') {
        this.bsDataList = bsDataResp.dataArray;
      }
    } else {
      this.appService.showAlert(bsDataResp);
    }
    this.appService.hideLoader();
  }

  async deleteData() {
    this.appService.showLoader();
    const deleteBsResp = await this.appService.deleteBsRecord(this.updateBsData);
    if (deleteBsResp.success === true) {
      this.appService.showAlert("Record Deleted Successfully");
      let dltRecordIdx = this.bsDataList.findIndex(bs => bs.record_id === this.updateBsData.record_id);
      this.bsDataList.splice(dltRecordIdx, 1);
      this.updateBsData = {};
      var closeBtn = document.getElementById('close-delete-btn');
      closeBtn!.click();
    } else {
      this.appService.showAlert(deleteBsResp);
    }
    this.appService.hideLoader();
  }

  async submitData() {
    if ((this.bsData.fbs === undefined || this.bsData.fbs === null || this.bsData.fbs === 0) &&
      (this.bsData.postprandial === undefined || this.bsData.postprandial === null || this.bsData.postprandial === 0)) {
      this.appService.showAlert("Please enter a valid NON-ZERO value");
      return;
    }
    this.appService.showLoader();
    let inpData = {
      fbs: (this.bsData.fbs === undefined || this.bsData.fbs === null) ? 0 : this.bsData.fbs,
      postprandial: (this.bsData.postprandial === undefined || this.bsData.postprandial === null) ? 0 : this.bsData.postprandial,
      record_date_fst: (this.bsData.fbs === undefined || this.bsData.fbs === null) ? this.appService.convertDateForSQL() : this.bsData.record_date_fst,
      record_date_pp: (this.bsData.postprandial === undefined || this.bsData.postprandial === null) ? this.appService.convertDateForSQL() : this.bsData.record_date_pp,
      check_sum: this.appService.generateUUID(),
      user_id: this.appService.getAppUserId
    }
    const saveBsResp = await this.appService.saveBsRecord(inpData);
    if (saveBsResp.success === true) {
      this.onAddDataSection('SHOW');
      this.appService.showAlert("Record Added Successfully");
      inpData.fbs = inpData.fbs.toString();
      inpData.postprandial = inpData.postprandial.toString();
      this.bsData = {};
      this.loadBsData();
    }
    this.appService.hideLoader();
  }

  async updateData() {
    let oldFbs = this.bsDataList.filter(bs => bs.record_id === this.updateBsData.record_id)[0].fbs;
    let oldPp = this.bsDataList.filter(bs => bs.record_id === this.updateBsData.record_id)[0].postprandial;
    if (((this.updateBsData.fbs === undefined || this.updateBsData.fbs === null || Number(this.updateBsData.fbs) === 0) && Number(oldFbs) !== 0) ||
      ((this.updateBsData.postprandial === null || this.updateBsData.postprandial === undefined || Number(this.updateBsData.postprandial) === 0) && Number(oldPp) !== 0) ||
      this.updateBsData.record_date_fst === undefined || this.updateBsData.record_date_fst === null ||
      this.updateBsData.record_date_pp === undefined || this.updateBsData.record_date_pp === null) {
      this.appService.showAlert("All the fields are mandatory. Do not leave any field empty or blank.");
      return;
    }
    this.updateBsData.record_date_fst = this.appService.convertDateForSQL(this.updateBsData.record_date_fst);
    this.updateBsData.record_date_pp = this.appService.convertDateForSQL(this.updateBsData.record_date_pp);
    this.appService.showLoader();
    const updateBsResp = await this.appService.updateBsRecord(this.updateBsData);
    if (updateBsResp.success === true) {
      this.appService.showAlert("Record Updated Successfully");
      let updRecord = this.bsDataList.filter(bs => bs.record_id === this.updateBsData.record_id)[0];
      updRecord.fbs = this.updateBsData.fbs;
      updRecord.postprandial = this.updateBsData.postprandial;
      updRecord.record_date_fst = this.updateBsData.record_date_fst;
      updRecord.record_date_pp = this.updateBsData.record_date_pp;
      this.updateBsData = {};
      var closeBtn = document.getElementById('close-update-btn');
      closeBtn!.click();
    } else {
      this.appService.showAlert(updateBsResp);
    }
    this.appService.hideLoader();
  }

  async saveFbsOrPp(type: string) {
    this.updateBsData.record_date_fst = this.appService.convertDateForSQL(this.updateBsData.record_date_fst);
    this.updateBsData.record_date_pp = this.appService.convertDateForSQL(this.updateBsData.record_date_pp);
    if (type === 'FBS') {
      if (this.updateBsData.fbs === undefined || this.updateBsData.fbs === null || Number(this.updateBsData.fbs) === 0) {
        this.appService.showAlert("Please enter a valid NON-ZERO value");
        return;
      }
      this.updateBsData.record_date_fst = this.appService.convertDateForSQL();
    } else {
      if (this.updateBsData.postprandial === undefined || this.updateBsData.postprandial === null || Number(this.updateBsData.postprandial) === 0) {
        this.appService.showAlert("Please enter a valid NON-ZERO value");
        return;
      }
      this.updateBsData.record_date_pp = this.appService.convertDateForSQL();
    }
    this.appService.showLoader();
    const updateBsResp = await this.appService.updateBsRecord(this.updateBsData);
    if (updateBsResp.success === true) {
      this.appService.showAlert("FBS/PP Value Added Successfully");
      let updRecord = this.bsDataList.filter(bs => bs.record_id === this.updateBsData.record_id)[0];
      if (type === 'FBS') {
        updRecord.fbs = this.updateBsData.fbs;
        updRecord.record_date_fst = this.updateBsData.record_date_fst;
      } else {
        updRecord.postprandial = this.updateBsData.postprandial;
        updRecord.record_date_pp = this.updateBsData.record_date_pp;
      }
      this.updateBsData = {};
      var closeBtn = document.getElementById('close-update-btn');
      closeBtn!.click();
    } else {
      this.appService.showAlert(updateBsResp);
    }
    this.appService.hideLoader();
  }

  addFbsOrPP(type: string) {
    this.updateBsData = {};
    if (type === 'FBS') {
      this.updateBsData["isAddFbs"] = true;
    } else {
      this.updateBsData["isAddPp"] = true;
    }
    this.updateBsData["do_init"] = false;
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

  populateForModal(data: any) {
    if (this.updateBsData.do_init) {
      this.updateBsData = {};
    }
    this.updateBsData["fbs"] = data.fbs;
    this.updateBsData["postprandial"] = data.postprandial;
    if (data.record_date_fst != null) {
      this.updateBsData["record_date_fst"] = new Date(data.record_date_fst);
    } else {
      this.updateBsData["record_date_fst"] = new Date();
    }
    if (data.record_date_pp != null) {
      this.updateBsData["record_date_pp"] = new Date(data.record_date_pp);
    } else {
      this.updateBsData["record_date_pp"] = new Date();
    }
    this.updateBsData["check_sum"] = data.check_sum;
    this.updateBsData["user_id"] = this.appService.getAppUserId;
    this.updateBsData["record_id"] = data.record_id;
    this.updateBsData["do_init"] = true;
  }

  getClassVal(data: any) {
    let finalClassVal = 'bi-check-circle-fill';
    let goodnessVal = this.appService.calculateBsGoodness(data.fbs, data.postprandial);
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
    let highLowVal = this.appService.calculateBsHighLow(data.fbs, data.postprandial, goodnessVal);
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
}

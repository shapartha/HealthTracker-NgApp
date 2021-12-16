import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AppConstant } from 'src/constant/app.const';
import { MatSnackBar } from '@angular/material/snack-bar';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  
    apiServerUrl: string = "https://shapartha-android-zone.000webhostapp.com/healthtracker/api/";
    API_GET_TOKEN: string = "getToken";
    static API_KEY: string = "d7e1a3d7dd2a43a4";
    appToken: string = "";
    appUserId: string = "";
    API_LOGIN_USER = "getUserDataEmailPassword";
    API_GET_ALL_BP_DATA = "getBpDataUserId";
    API_SAVE_BP_DATA = "storeBpData";
    API_UPDATE_BP_DATA = "updateBpData";
    API_DELETE_BP_DATA = "deleteBpData";

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) { 
    if (this.getAppToken == "") {
      this.invokeTokenCall();
    }
  }

  invokeTokenCall() {
      this.getToken({ api_key: AppService.API_KEY }).subscribe(data => {
          if (data.success) {
              this.setAppToken = data.dataArray.token;
          }
      });
  }

  public get getAppToken() : string {
      return this.getCookie('app-token-ht');
  }
  
  public set setAppToken(appToken : string) {
      this.setCookie("app-token-ht", appToken, 3);
  }

  public get getAppUserId() : string {
      return this.getCookie('app-user-id-ht');
  }
  
  public set setAppUserId(v : string) {
      this.setCookie("app-user-id-ht", v, 30);
  }

  generateUUID() {
    return uuidv4();
  }

  /**
   * Returns -1 if GOOD, 0 if HIGH, 1 if LOW
   * 
   * @param sys Systolic Value
   * @param dia Diastolic Value
   * @param pulse Pulse Value
   */
  calculateBpHighLow(sys: number, dia: number, pulse: number, goodnessVal: number) {
        if (goodnessVal === 1) {
            return -1;
        }
        let constVal = AppConstant.BLOOD_PRESSURE_VALUE;
        let badSysVals = constVal.BAD.SYS;
        let badDiaVals = constVal.BAD.DIA;
        let badPulseVals = constVal.BAD.PULSE;
        let avgSysVals = constVal.AVG.SYS;
        let avgDiaVals = constVal.AVG.DIA;
        let avgPulseVals = constVal.AVG.PULSE;
        var sysRes = 1, diaRes = 1, pulseRes = 1;
        if (goodnessVal == 0) {
            for (let i = 0; i < avgSysVals.length; i++) {
                if (sys <= avgSysVals[i].HIGH && sys >= avgSysVals[i].LOW) {
                    sysRes = i;
                    break;
                }
            }
            for (let i = 0; i < avgDiaVals.length; i++) {
                if (dia <= avgDiaVals[i].HIGH && dia >= avgDiaVals[i].LOW) {
                    diaRes = i;
                    break;
                }
            }
            for (let i = 0; i < avgPulseVals.length; i++) {
                if (sys <= avgPulseVals[i].HIGH && sys >= avgPulseVals[i].LOW) {
                    pulseRes = i;
                    break;
                }
            }
            if (sysRes == 1 && diaRes == 1 && pulseRes == 1) {
                return 0;
            } else {
                return 1;
            }
        } else {
            for (let i = 0; i < badSysVals.length; i++) {
                if (sys <= badSysVals[i].HIGH && sys >= badSysVals[i].LOW) {
                    sysRes = i;
                    break;
                }
            }
            for (let i = 0; i < badDiaVals.length; i++) {
                if (dia <= badDiaVals[i].HIGH && dia >= badDiaVals[i].LOW) {
                    diaRes = i;
                    break;
                }
            }
            for (let i = 0; i < badPulseVals.length; i++) {
                if (sys <= badPulseVals[i].HIGH && sys >= badPulseVals[i].LOW) {
                    pulseRes = i;
                    break;
                }
            }
            if (sysRes == 0 || diaRes == 0 || pulseRes == 0) {
                return 0;
            } else {
                return 1;
            }
        }
  }

  /**
   * Returns -1 if BAD, 0 if AVERAGE, 1 if GOOD
   * 
   * @param sys Systolic Value
   * @param dia Diastolic Value
   * @param pulse Pulse Value
   */
  calculateBpGoodness(sys: number, dia: number, pulse: number) {
      let constVal = AppConstant.BLOOD_PRESSURE_VALUE;
      let goodSysVals = constVal.GOOD.SYS;
      let goodDiaVals = constVal.GOOD.DIA;
      let goodPulseVals = constVal.GOOD.PULSE;
      let avgSysVals = constVal.AVG.SYS;
      let avgDiaVals = constVal.AVG.DIA;
      let avgPulseVals = constVal.AVG.PULSE;
      var sysRes = -1, diaRes = -1, pulseRes = -1;
      for (let i = 0; i < goodSysVals.length; i++) {
            if (sys <= goodSysVals[i].HIGH && sys >= goodSysVals[i].LOW) {
                sysRes = 1;
                break;
            }
      }
      for (let i = 0; i < goodDiaVals.length; i++) {
            if (dia <= goodDiaVals[i].HIGH && dia >= goodDiaVals[i].LOW) {
                diaRes = 1;
                break;
            }
      }
      for (let i = 0; i < goodPulseVals.length; i++) {
            if (pulse <= goodPulseVals[i].HIGH && pulse >= goodPulseVals[i].LOW) {
                pulseRes = 1;
                break;
            }
      }
      if (sysRes == 1 && diaRes == 1 && pulseRes == 1) {
            return 1;
      } else {
            if (sysRes !== 1) {
                for (let i = 0; i < avgSysVals.length; i++) {
                    if (sys <= avgSysVals[i].HIGH && sys >= avgSysVals[i].LOW) {
                        sysRes = 0;
                        break;
                    }
                }
            }
            if (diaRes !== 1) {
                for (let i = 0; i < avgDiaVals.length; i++) {
                    if (dia <= avgDiaVals[i].HIGH && dia >= avgDiaVals[i].LOW) {
                        diaRes = 0;
                        break;
                    }
                }
            }
            if (pulseRes !== 1) {
                for (let i = 0; i < avgPulseVals.length; i++) {
                    if (pulse <= avgPulseVals[i].HIGH && pulse >= avgPulseVals[i].LOW) {
                        pulseRes = 0;
                        break;
                    }
                }
            }
            if (sysRes >= 0 && diaRes >= 0 && pulseRes >= 0) {
                  return 0;
            } else {
                return -1;
            }
      }
  }

  showLoader() {
      let _loaderDiv = document.getElementById("loader-container");
      let _displayStatus = _loaderDiv!.style.display;
      if (_displayStatus.toUpperCase() == "NONE") {
          _loaderDiv!.style.display = '';
      }
  }

  hideLoader() {
      let _loaderDiv = document.getElementById("loader-container");
      let _displayStatus = _loaderDiv!.style.display;
      if (_displayStatus.toUpperCase() != "NONE") {
          _loaderDiv!.style.display = 'none';
      }
  }

  //#region Cookie
  setCookie(name: string, value: any, days: number) {
      var expires = "";
      if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days*24*60*60*1000));
          expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }
  getCookie(name: string) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return "";
  }
  eraseCookie(name: string) {   
      document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  //#endregion Cookie

    handleTabChange(uri: any) {
        this.router.navigate([uri]);
    }

    showAlert(msg: string | object, actionTxt?: string) {
        if (actionTxt == undefined || actionTxt == null) {
            actionTxt = "Close";
        }
        if (typeof msg !== 'string') {
            msg = "An error occurred -> " + JSON.stringify(msg);
        }
        this.snackBar.open(msg, actionTxt);
        setTimeout(() => {
            this.snackBar.dismiss();
        }, 5000);
    }

    padLeadingZero(s: any) { 
        return (s < 10) ? '0' + s : s; 
    }

    convertDate(_date?: any) {
        var d = new Date();
        if (_date !== undefined && _date !== null) {
            d = new Date(_date);
        }
        return [this.padLeadingZero(d.getDate()), this.padLeadingZero(d.getMonth()+1), d.getFullYear()].join('-') + ' ' + 
        [this.padLeadingZero(d.getHours()), this.padLeadingZero(d.getMinutes()), this.padLeadingZero(d.getSeconds())].join(':')
    }

    convertDateForSQL(_date?: any) {
        var d = new Date();
        if (_date !== undefined && _date !== null) {
            d = new Date(_date);
        }
        return [d.getFullYear(), this.padLeadingZero(d.getMonth()+1), this.padLeadingZero(d.getDate())].join('-') + ' ' + 
        [this.padLeadingZero(d.getHours()), this.padLeadingZero(d.getMinutes()), this.padLeadingZero(d.getSeconds())].join(':')
    }
    
    formatDate(val: string): string {
        let _tConst = '';
        if (val.indexOf(' ') !== -1) {
            _tConst = ' ' + val.split(" ")[1];
            val = val.split(" ")[0];
        }
        let _temp = val.split("-");
        if (_temp[2].length == 4) {
            return _temp[0] + "-" + this.getMonthName(_temp[1]) + "-" + _temp[2] + _tConst;
        }
        return _temp[2] + "-" + this.getMonthName(_temp[1]) + "-" + _temp[0] + _tConst;
    }

    getMonthName(val: string): string {
        return AppConstant.MONTH[parseInt(val)];
    }

    getMonthNumber(val: string): number {
        let monthJson = AppConstant.MONTH;
        let resp = '';
        for (var key in monthJson) {
            if (monthJson[key] === val) {
                resp = key;
                break;
            }
        }
        return Number(resp);
    }

    /**
     * HTTP REST API Calls start from here
     * 
     */
    
    appendMandatoryParams(): string {
        let _apiJsonParams = "&apiKey=" + AppService.API_KEY;
        _apiJsonParams += "&apiToken=" + this.getAppToken;
        return _apiJsonParams;
    }

    getToken(apiFuncParams: any): Observable<any> {
        let apiFuncName = this.API_GET_TOKEN;
        return this.http.get<any>(this.apiServerUrl + "?apiFunctionName=" + encodeURIComponent(apiFuncName) + "&apiFunctionParams=" + encodeURIComponent(JSON.stringify(apiFuncParams)));
    }

    loginUser(apiFuncParams: any) {
        return this.callRestApi(this.API_LOGIN_USER, apiFuncParams);
    }

    getBpRecords(apiFuncParams: any) {
        return this.callRestApi(this.API_GET_ALL_BP_DATA, apiFuncParams);
    }

    saveBpRecord(apiFuncParams: any) {
        return this.callRestApi(this.API_SAVE_BP_DATA, apiFuncParams);
    }

    updateBpRecord(apiFuncParams: any) {
        return this.callRestApi(this.API_UPDATE_BP_DATA, apiFuncParams);
    }

    deleteBpRecord(apiFuncParams: any) {
        return this.callRestApi(this.API_DELETE_BP_DATA, apiFuncParams);
    }

    callRestApi(apiFuncName: string, apiFuncParams: any) : Promise<any> {
        const headers = { 
            'content-type': 'application/x-www-form-urlencoded',
            'accept': 'application/json'
        };
        let promise = new Promise((resolve, reject) => {
            this.http.post(this.apiServerUrl, "apiFunctionName=" + encodeURIComponent(apiFuncName) + "&apiFunctionParams=" + encodeURIComponent(JSON.stringify(apiFuncParams)) + this.appendMandatoryParams(),
            {'headers': headers}).toPromise()
            .then(resp => {
                resolve(resp);
            }, err => {
                reject(err)
            });
        })
        return promise;
    }

    /**
     * HTTP REST API Calls ends here
     */
}

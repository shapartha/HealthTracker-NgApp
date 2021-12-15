import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AppConstant } from 'src/constant/app.const';
import { MatSnackBar } from '@angular/material/snack-bar';

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
        return [this.padLeadingZero(d.getDate()), this.padLeadingZero(d.getMonth()+1), d.getFullYear()].join('-')
    }
    
    formatDate(val: string): string {
        let _temp = val.split("-");
        if (_temp[2].length == 4) {
            return _temp[0] + "-" + this.getMonthName(_temp[1]) + "-" + _temp[2];
        }
        return _temp[2] + "-" + this.getMonthName(_temp[1]) + "-" + _temp[0];
    }

    getMonthName(val: string): string {
        return AppConstant.MONTH[parseInt(val)];
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

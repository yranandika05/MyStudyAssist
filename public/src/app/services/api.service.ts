import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, map} from "rxjs";
import {SessionService} from "./session.service";
import { catchError } from 'rxjs/operators'; // Add this line


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private serverUrl = 'http://10.48.16.82:8000/';

  constructor(
    private http: HttpClient,
    private storage: SessionService
  ) { }


  login(payload: any, data: string): Observable<boolean>{
    const url = this.serverUrl + data;
    return this.http.get(url).pipe(
      map((response: any) => {
        const toObj = JSON.parse(JSON.stringify(response));
        if(toObj.password == payload.password){
          this.storage.setItem('studentid', toObj.studentid, true);
        }
        return toObj.password;
      }),
      map((password: string) => password === payload.password) // Replace 'YOUR_INPUT_PASSWORD' with the actual input password
    );
  }

  postFormData(payload: any, data: string): Observable<any> {
    const url = this.serverUrl + data;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    return this.http.post(url, JSON.stringify(payload), options)

  }

  get(data: string): any{
    const url = this.serverUrl + data + '?format=json';
    return this.http.get(url);
  }

  post(payload: any,data: string): Observable<any> {
    payload = JSON.parse(JSON.stringify(payload));
    let url: any = this.serverUrl + data + '?';
    return this.http.post(url, payload);
  }




  put(payload: any, data: string): Observable<any> {
    const url = this.serverUrl + data;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };

    return this.http.put(url, JSON.stringify(payload), options);
  }

  delete(data: string): any{
    const url = this.serverUrl + data;
    console.log(url);
    return this.http.delete(url);
  }
}

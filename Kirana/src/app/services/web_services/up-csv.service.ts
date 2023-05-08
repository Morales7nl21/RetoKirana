import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/enviroment/enviroment';
@Injectable({
  providedIn: 'root'
})
export class UpCsvService {
  private domain: string = enviroment.endpoint;
  resultApi:Observable<any> | undefined;
  constructor(private http: HttpClient) {}
  sendFile(body:FormData):void{

    let uri = "/api/getcsvdata";
    this.resultApi =  this.http.post(this.domain+uri,body);
  }
}

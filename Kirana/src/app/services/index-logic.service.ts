import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexLogicService {
  private isAccepted:boolean=false;
  constructor() { }
  public getIsAccepted():boolean{
    return this.isAccepted;
  }
  public setIsAccepted(isAccepted:boolean):void{
     this.isAccepted=isAccepted;
  }
}

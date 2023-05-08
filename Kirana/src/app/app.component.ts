import { Component } from '@angular/core';
import { IndexLogicService } from './services/index-logic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private indexLogicService:IndexLogicService){
  }
  getIsAccepted(){
    return this.indexLogicService.getIsAccepted();
  }
}

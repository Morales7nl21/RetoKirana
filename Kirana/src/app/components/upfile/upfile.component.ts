import { Component } from '@angular/core';
import { IndexLogicService } from 'src/app/services/index-logic.service';
import { UpCsvService } from 'src/app/services/web_services/up-csv.service';

@Component({
  selector: 'app-upfile',
  templateUrl: './upfile.component.html',
  styleUrls: ['./upfile.component.css']
})
export class UpfileComponent {

  isSelectedFile = false;
  isAcceptedFile: boolean;
  name: string = "";
  fileTmp:any;
  files: File[] = [];

  constructor(private indexLogicService:IndexLogicService, private upCsvService:UpCsvService){
    this.isAcceptedFile=this.indexLogicService.getIsAccepted();
  }
onSelect($event:any) {

  if( this.isSelectedFile === false){
    const [file] = $event?.target.files;

    this.fileTmp={
      fileRaw:file,
      fileName:file.name
    };
    this.name = file.name;
    console.log(file,this.fileTmp.fileRaw)
    this.isSelectedFile=!this.isSelectedFile;

  }
}

onSelect2(event: { addedFiles: any; }) {
  console.log(event);
  this.files.push(...event.addedFiles);
  this.fileTmp={
    fileRaw:this.files[0],
  };
  this.name = this.files[0].name;
  this.isSelectedFile=!this.isSelectedFile;
}


acceptFile(){
  this.indexLogicService.setIsAccepted(true);
  this.isAcceptedFile=!this.isAcceptedFile;
  console.log(this.fileTmp)


  var body = new FormData();
  body.append('CSV',this.fileTmp.fileRaw);
  console.log("body",body.get("fileRaw"));

  this.upCsvService.sendFile(body);
}

onRemove() {
  this.files.pop();
  this.isSelectedFile=!this.isSelectedFile;
}
}

import { Component, OnInit } from '@angular/core';
import { IconsService } from '../../../../Services/icons.service';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css'
})
export class StudentDetailsComponent  implements OnInit{

  isView : boolean = true;
  isSuivis : boolean = false;
  constructor(public icons: IconsService) { }

  ngOnInit(): void {
      
  }
  // view
  getView(){
    this.isSuivis = false
    this.isView = true;
  }
  // suivis
  getSuivis(){
    this.isView = false;
    this.isSuivis  = true;
    

  }

  //back
  goBack(){
    history.back();
  }
}

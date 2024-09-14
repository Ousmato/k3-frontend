import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetService } from './set.service';
import { IconsService } from '../../../Services/icons.service';
import { SchoolInfo } from '../../Models/School-info';
import { SchoolService } from '../../../Services/school.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  
  fileName?: File;

  school?: SchoolInfo

  addUe!: FormGroup;


  isshow_school_detail: boolean = false
  isshow_school_update: boolean = false
  isOverlay : boolean = false

  constructor( private schoolService: SchoolService,
    private service: SetService, public icons: IconsService, private router: Router){}
  
    ngOnInit() {;
    this.getSchoolInfo();
   
  }
  annuler(){
  this. isshow_school_detail = false
  this. isshow_school_update = false

  }
  // ----------------------------------------------get school information
  getSchoolInfo(){
    this.schoolService.getSchools().subscribe(info => {
      this.school = info;
        this.school.urlPhoto = `http://localhost/StudentImg/${this.school.urlPhoto}`;
        // this.load_school_input_value(this.school)
      })
    
  }

  // -------------------------------------------------
  onFileSelected(event: any)  {
    this.fileName = event.target.files[0];
  }
 
  // -------------------------------------------------------------------
  show_school_detail(){
    this.isshow_school_detail =! this.isshow_school_detail;
    
  }
  preventClick(event: MouseEvent): void {
    event.stopPropagation(); // Empêche la propagation de l'événement de clic
  }
  // ----------------------------------------------------------
  toggle_to_update_school(){
    this.router.navigate(['/dga/update-school']);
  }

  // -----------------------niveau close
  closeNiveau(){
    this.isOverlay =! this.isOverlay
  }
}

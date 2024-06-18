import { Component, OnInit } from '@angular/core';
import { faEye,faPlus,faBookOpen,faCalendar, faBell, faClipboard, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { ClassStudentService } from './class-student.service';
import { ClassRoom } from '../../Models/Classe';
import { SetService } from '../settings/set.service';
import { Module } from '../../Models/Module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassModules } from '../../Models/ClassModule';
import { Ue } from '../../Models/UE';

@Component({
  selector: 'app-class-students',
  templateUrl: './class-students.component.html',
  styleUrl: './class-students.component.css'
})
export class ClassStudentsComponent implements OnInit {
  faEye = faEye; fanot = faBell; fanote = faClipboard; faElip = faEllipsis;
  fadd = faPlus; fabook = faBookOpen; faEmploi =faCalendar;
  classRoms : ClassRoom[]=[];
  classes!: ClassRoom;
  ueList: any[] = [];
  addModules!: FormGroup;

  constructor(private service : ClassStudentService, private setSevice: SetService, private fb: FormBuilder){
    
  }

  isOpen = false;

   // Dropdown states
   dropdownStates: { [key: number]: boolean } = {};

   toggleDropdown(id: number) {
     this.dropdownStates[id] = !this.dropdownStates[id];
   }
 
   isDropdownOpen(id: number): boolean {
     return this.dropdownStates[id] || false;
   }
  ngOnInit() {
    
    this.service.getAll().subscribe((classRoms : ClassRoom[]) =>{
      this.classRoms = classRoms;
      console.log(this.classRoms);
    });
    // ------------------------get all module
    
    // -----------------------------------------form class modules
    this.addModules = this.fb.group({
     
      // idClasse: [],
      idUE: [[]]
    });
  }
// ----------------------------------------add module in classRoom
  createClassModule(idClasse: number){
    const formData = this.addModules.value;
    const idClass: ClassRoom = this.classRoms.find(cl => cl.id === idClasse)!;
    const modules = formData.idUE.map((idUe: number) => ({
      idStudentClasse: idClass,
      idUE: { id: idUe }
    }));

    console.log(modules);
    // return
    
   this.service.createClassModule(modules).subscribe(response =>{
    console.log(response);
    alert("Ajout avec succees!");
    window.location.reload();
   })

  }
  // ------------------------------------------get all ue by class id
  getAll_ues(idClasse: number){
    this.setSevice.getAll_ue(idClasse).subscribe((response: Ue[]) =>{
      this.ueList = response;
      console.log(this.ueList);
    })
  }
}

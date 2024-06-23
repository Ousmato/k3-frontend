import { Component, OnInit } from '@angular/core';
import { faEye,faPlus,faBookOpen,faCalendar, faBell, faClipboard, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { ClassStudentService } from './class-student.service';
import { ClassRoom } from '../../Models/Classe';
import { SetService } from '../settings/set.service';
import { Module } from '../../Models/Module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassModules } from '../../Models/ClassModule';
import { Ue } from '../../Models/UE';
import { ServiceService } from '../emplois-du-temps/service.service';
import { forkJoin } from 'rxjs';
import { Emplois } from '../../Models/Emplois';
import { map } from 'rxjs';
import { NavigationExtras, Route, Router } from '@angular/router';

@Component({
  selector: 'app-class-students',
  templateUrl: './class-students.component.html',
  styleUrl: './class-students.component.css'
})
export class ClassStudentsComponent implements OnInit {
  faEye = faEye; fanot = faBell; fanote = faClipboard; faElip = faEllipsis;
  fadd = faPlus; fabook = faBookOpen; faEmploi =faCalendar;
  classRoms : ClassRoom[]=[];
  classesWithEmplois: ClassRoom[] = [];
  classes!: ClassRoom;
  classroom: ClassRoom[] =[];
  idCurrent!: ClassRoom;
  emplois!: Emplois;
  seance: any;
  hasEmplois!: boolean;
  emploisData: any;
  // classesWithEmplois!: { [key: number]: boolean } = {};
  ueList: any[] = [];
  isDesabled: boolean = false;
  addModules!: FormGroup;

  constructor(private service : ClassStudentService, private emploisService: ServiceService,
    private setSevice: SetService, private fb: FormBuilder, private router: Router){
    
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
    // checkEmplois()
  //  this.loadClassesWithEmplois(this.classes);
   this.loadClasses();
    // -----------------------------------------form class modules
    this.addModules = this.fb.group({
      idUE: [[]]
    });
  }
  // ------------------------------------------get all classRoom
  loadClasses(): void {
    this.service.getAll().subscribe((classRoms: ClassRoom[]) => {
      this.classRoms = classRoms;
    });
  }
// ----------------------------------------add module in classRoom
  createClassModule(idClasse: number){
    
    const formData = this.addModules.value;
    const idClass: ClassRoom = this.classRoms.find(cl => cl.id === idClasse)!;
    this.idCurrent = idClass;
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
 
   // --------------------methode appeller tout les classee et 
    // pour verifier l'existence d'emplois
   loadClassesWithEmplois(Classeroom : ClassRoom): void {
    this.classesWithEmplois.push(Classeroom)
   
  }
   // -----------------------------------------method de condition de navigation
 
  navigateBasedOnCondition(classRom: ClassRoom): void {
    // console.log(classRom.id);
    this.emploisService.hasActiveEmploisByClasse(classRom.id!).subscribe(hasEmplois => {
       if (hasEmplois === false) {
       
        console.log("avec des seance")
        // Si la classe a un emploi du temps actif avec des séances, naviguer vers la page de création de séances
        const navigationExtras: NavigationExtras = {
          queryParams: { id: classRom.id }
        };
        this.router.navigate(['/sidebar/emplois'], navigationExtras);
      } else if(hasEmplois === true) {
        console.log("pas des seance")
       
        this.emplois = hasEmplois;
        const navigationExtras: NavigationExtras = {
          queryParams: { id: classRom.id }
        };
        this.router.navigate(['/sidebar/seance'], navigationExtras);
        
        // Sinon, naviguer vers la page de création d'emploi du temps
        
      }else{
        this.loadClassesWithEmplois(classRom)
        // this.classesWithEmplois.push(classRom);
       
      }
    });
  }
  // -----------------------
 
}

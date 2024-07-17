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
import { data } from 'jquery';
import { IconsService } from '../../../Services/icons.service';

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

  classeSelect!: any
  class_extrate_ue!: any

  ueList: any[] = [];
  isDesabled: boolean = false;
  isShow_add_module : boolean = false
  notFund_modal : boolean = true
  isShow_link_modal : boolean = true
  addModules!: FormGroup;

  constructor(private service : ClassStudentService, private emploisService: ServiceService,
    private setSevice: SetService, private fb: FormBuilder, private router: Router, public icons: IconsService){
    
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
  createClassModule(classe: any){
    
    const formData = this.addModules.value;
    // console.log(idClasse, "formdata");
    const idClass: ClassRoom = this.classRoms.find(cl => cl.id === classe.id)!;
    this.idCurrent = idClass;
    console.log(this.idCurrent, "clall------------")
    const modules = formData.idUE.map((idUe: number) => ({
      idStudentClasse: idClass,
      idUE: { id: idUe }
    }));

    console.log(modules, "Select modules");
    // return
    
   this.service.createClassModule(modules).subscribe(response =>{
    console.log(response);
    alert("Ajout avec succees!");
    window.location.reload();
   })

  }
  // ------------------------------------------get all ue by class id
  getAll_ues(idClasse: number){
    this.classeSelect = null;
    this.setSevice.getAll_ue_not_associate_class(idClasse).subscribe((response: Ue[]) =>{
      this.ueList = response;
      console.log(this.ueList, "id de la classe")
      if(this.ueList.length == 0){
        this.notFund_modal = true
        this.isShow_add_module = true
      }
      // this.show_views()
    //  this.isShow_add_module =! this.isShow_add_module
    //  this.isShow_link_modal  =! this.isShow_link_modal
      
    })
  }
 
   // --------------------methode appeller tout les classee et 
    // pour verifier l'existence d'emplois
   loadClassesWithEmplois(Classeroom : ClassRoom): void {
    this.classesWithEmplois.push(Classeroom)
   
  }
   // -----------------------------------------method de condition de navigation
 show_views(classe: any){
  // console.log(classe, "la classe-------------")
  if (this.classeSelect === classe) {
    this.classeSelect = null; // Deselect if already selected
  } else {
    this.classeSelect = classe; // Select the clicked item
    this.emploisService.hasActiveEmploisByClasse(classe.id!).subscribe(hasEmplois => {
      if(hasEmplois == false){
        this.isDesabled = false
      }else{
        this.isDesabled = true
      }

    })
  }
}
exit(){
    this.ueList = []; 
   
  //  this.isShow_link_modal = false
}

exit_modal(){
  this.notFund_modal = !this.notFund_modal
}
 
toggle_to_emplois(classRom: ClassRoom): void {
    // console.log(classRom.id);
    this.emploisService.hasActiveEmploisByClasse(classRom.id!).subscribe(hasEmplois => {
       if (hasEmplois == false) {
       
        // Si la classe a un emploi du temps actif avec des séances, naviguer vers la page de création de séances
        const navigationExtras: NavigationExtras = {
          queryParams: { id: classRom.id }
        };

        this.router.navigate(['/sidebar/emplois'], navigationExtras);
      } else {
       
        const navigationExtras: NavigationExtras = {
          queryParams: { id: classRom.id }
        };
        this.router.navigate(['/sidebar/seance'], navigationExtras);
        
        // Sinon, naviguer vers la page de création d'emploi du temps
        
      }
    
    });
  }
  // ----------------------- method go to add notes aux student
  toggle_to_notes(idClasse: number){
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idClasse }
    };
    this.router.navigate(['/sidebar/student-notes'], navigationExtras);
  }
  //  -------------------------hover bottom button 
  toggle_to_noteSemestre(idClasse: number){
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idClasse }
    };
    this.router.navigate(['/sidebar/all-notes'], navigationExtras);
  }
  // ------------------------------link go to list students by class
  toggle_to_presence(idClasse: number){
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idClasse }
    };
    this.router.navigate(['/sidebar/etudiant-de-la-classe'], navigationExtras);
  }
  // ----------------------------------------lint to go to the param
  goToParamettre(){
    this.router.navigate(['/sidebar/parametre']);
  }
}

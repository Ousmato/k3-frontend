import { Component, OnInit } from '@angular/core';
// import { faEye,faPlus,faBookOpen,faCalendar, faBell, faClipboard, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { ClassStudentService } from './class-student.service';
import { ClassRoom } from '../../Admin/Models/Classe';
import { SetService } from '../../Admin/Views/settings/set.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClassModules } from '../../Admin/Models/ClassModule';
import { ServiceService } from '../../DER/emplois-du-temps/service.service';
import { Emplois } from '../../Admin/Models/Emplois';
import { NavigationExtras, Route, Router } from '@angular/router';
import { IconsService } from '../../Services/icons.service';
import { ToastrService } from 'ngx-toastr';
import { SideBarService } from '../../sidebar/side-bar.service';

@Component({
  selector: 'app-class-students',
  templateUrl: './class-students.component.html',
  styleUrl: './class-students.component.css'
})
export class ClassStudentsComponent implements OnInit {
 
  searchTerm : string = ""
  classRoms : ClassRoom[]=[];
  classesWithEmplois: ClassRoom[] = [];
  filteredClasse: ClassRoom[] = [];
  idCurrent!: ClassRoom;

  classeSelect!: any

  ueList: any[] = [];
  list_checked: any[] = [];
  isDesabled: boolean = false;
  isShow_add_module : boolean = false
  notFund_modal : boolean = true
  isShow_link_modal : boolean = true
  isShow_update_emplois: boolean = false
  addModules!: FormGroup;
  classes_L1:  ClassRoom[] =[]
  classes_L2:  ClassRoom[] =[]
  classes_L3:  ClassRoom[] =[]
  permission: boolean = false

  constructor(private service : ClassStudentService, private sideBarService: SideBarService,
    private emploisService: ServiceService, private toastr: ToastrService,
    private setSevice: SetService, private router: Router, public icons: IconsService){
    
  }
  ngOnInit() {
    this.getPermission();
    this.loadClasses();
    const formGroupControls: any = {};
    this.ueList.forEach(ue => {
      formGroupControls[ue.id] = new FormControl(false);
    });

    this.addModules = new FormGroup(formGroupControls);

    this.sideBarService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterClasse_L1();
      this.filterClasse_L2();
      this.filterClasse_L3();
      

    
    });
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
  //  -------------------------methode pour empecher les clic
  preventClick(event: MouseEvent): void {
    event.stopPropagation(); // Empêche la propagation de l'événement de clic
  }
 
  // ------------------------------------------get all classRoom
  loadClasses(): void {

    this.service.getAll().subscribe((classRoms: ClassRoom[]) => {

      this.classRoms = classRoms;
      this.classes_L1 = classRoms.filter(clr => clr.idFiliere?.idNiveau.nom === "LICENCE 1");
      this.classes_L2 = classRoms.filter(clr => clr.idFiliere?.idNiveau.nom === "LICENCE 2");
      this.classes_L3 = classRoms.filter(clr => clr.idFiliere?.idNiveau.nom === "LICENCE 3");

    });
  }
// ----------------------------------------add module in classRoom
  createClassModule(classe: any){
    
    const idClass: ClassRoom = this.classRoms.find(cl => cl.id === classe.id)!;
    this.idCurrent = idClass;
 
    const ues : ClassModules ={
      idStudentClasse: idClass,
      idUE: this.list_checked,
      
    }
    this.service.createClassModule(ues).subscribe({
      next: (response) =>{
          this.isShow_add_module = false
          this.isShow_link_modal = true
          this.list_checked = [];
          this.toastr.success(response.message, "Succès");
      },
      error: (erreur) => {
        this.toastr.error(erreur.error.message, "Erreur");
      }
    })
    console.log(ues, "object --liste")

  }
  // ------------------------------------------get all ue by class id
  getAll_ues(idClasse: number){
    this.setSevice.getAll_ue_not_associate_class(idClasse).subscribe({
      next: (response) =>{
        if(response.length > 0){
          this.ueList  = response;

          this.isShow_link_modal = false
          this.isShow_add_module = true
        }else if(this.ueList.length ==0){
          
          this.toastr.error("Aucun Unité d'enseignemants trouver veillez vous rendre dans le Paramètre pour ajouter", "Auccun");
        }
      }
    })
    
  }
 
  ue_check(idUe : number, event: any){
    const ue_find = this.ueList.find(uel => uel.id === idUe);
 
    if (ue_find) {
      if (event.target.checked) {
        if (!this.list_checked.some(lc => lc.id === ue_find.id)) {
          this.list_checked.push(ue_find);
        }
      } else {
        this.list_checked = this.list_checked.filter(lc => lc.id !== ue_find.id);
      }
      console.log(this.list_checked, event.target.checked ? "checked" : "unchecked");
    }
  }
// -----------------select all ues
selectAll(event : any){
  if (event.target.checked) {
    this.list_checked = [...this.ueList];
  } else {
    this.list_checked = [];
  }
  console.log(this.list_checked, event.target.checked ? "tous checked" : "tous unchecked");

}
  is_checked(idUe: number): boolean {
    return this.list_checked.some(lc => lc.id === idUe);
  }

  areAllChecked(): boolean {
    return this.list_checked.length === this.ueList.length;
  }
    // pour verifier l'existence d'emplois
   loadClassesWithEmplois(Classeroom : ClassRoom): void {
    this.classesWithEmplois.push(Classeroom)
   
  }
   // -----------------------------------------method de condition de navigation
 show_views(classe: any){
  console.log(classe,"dois etre changer")
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
    // this.ueList = []; 
    this.isShow_add_module = false
   
   this.isShow_link_modal = true
}
// ---------------------get permission to access
getPermission(): boolean {
  const autorize = sessionStorage.getItem('scolarite');
  if(autorize){
    this.permission = true
    console.log(autorize,"autorize")
    return true;
  }
  return false
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
        
        this.router.navigate(['/dga/emplois'], navigationExtras);
      } else {
       
        const navigationExtras: NavigationExtras = {
          queryParams: { id: classRom.id }
        };
        this.router.navigate(['/dga/seance'], navigationExtras);
        
      }
    
    });
  }
  // ----------------------- method go to add notes aux student
  toggle_to_notes(idClasse: number){
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idClasse }
    };
    if(this.getPermission()){
      console.log("scolarite")
      this.router.navigate(['/r-scolarite/student-notes'], navigationExtras);
    }else{
      console.log("dga")
      this.router.navigate(['/dga/student-notes'], navigationExtras);
      
    }
    
  }
  //  -------------------------hover bottom button 
  toggle_to_noteSemestre(idClasse: number){
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idClasse }
    };
    if(this.getPermission()){
      this.router.navigate(['/r-scolarite/all-notes'], navigationExtras);
      
    }else{
      this.router.navigate(['/dga/all-notes'], navigationExtras);
    }
    
  }
  // ------------------------------link go to list students by class
  toggle_to_presence(idClasse: number){
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idClasse }
    };
    if(this.getPermission()){
    this.router.navigate(['/r-scolarite/etudiant-de-la-classe'], navigationExtras);
    }else{
    this.router.navigate(['/dga/etudiant-de-la-classe'], navigationExtras);
      
    }
  }
  // ----------------------------------------lint to go to the param
  goToParamettre(){
    this.router.navigate(['/dga/setting']);
  }
  // -----------------------------------link to update emploi du temps
  toggle_to_update_emplois(idClasse: number){
    this.emploisService.hasActiveEmploisByClasse(idClasse).subscribe({
      next: (hasEmplois) => {
        if(hasEmplois == true){
          console.log(hasEmplois, "pas de seance")
          this.isShow_update_emplois = true
          this.isShow_link_modal = false

         
        } else if(hasEmplois == false) {
          console.log(hasEmplois, "seance pas d'emplois actif")
          this.toastr.error("Auccun emplois disponible", "Erreur")
        }else{
          this.toastr.error("L'emploi du temps ne peut pas etre modifier, des seances son deja associer", "Erreur")
           console.log(hasEmplois, "objet")
        }
       
      }
    })
    

  }
  // ----------------------event emit from child widget
  onCloseUpdateModal(idClasse: number){
    this.isShow_update_emplois = false;
     const clfind = this.classRoms.find(cl => cl.id == idClasse);
    //  console.log(clfind,  "event class")
    this.isShow_link_modal = true;
    this.loadClasses();
    if(this.classeSelect == clfind){
      this.show_views(clfind)

    }
    
  }
  // ----------------------filtered 
  filterClasse_L1(){
    if(!this.searchTerm){
       return this.filteredClasse = this.classes_L1;
    }
   return this.filteredClasse = this.classes_L1.filter(clf => clf.idFiliere?.idFiliere.nomFiliere.toLowerCase().includes(this.searchTerm.toLowerCase())||
   clf.idFiliere?.idNiveau.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()))
  }
  filterClasse_L2(){
    if(!this.searchTerm){
       return this.filteredClasse = this.classes_L2;
    }
   return this.filteredClasse = this.classes_L1.filter(clf => clf.idFiliere?.idFiliere.nomFiliere.toLowerCase().includes(this.searchTerm.toLowerCase())||
   clf.idFiliere?.idNiveau.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()))
  }
  filterClasse_L3(){
    if(!this.searchTerm){
       return this.filteredClasse = this.classes_L3;
    }
   return this.filteredClasse = this.classes_L1.filter(clf => clf.idFiliere?.idFiliere.nomFiliere.toLowerCase().includes(this.searchTerm.toLowerCase())||
   clf.idFiliere?.idNiveau.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()))
  }
}

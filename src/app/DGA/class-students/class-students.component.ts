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
import { AnneeScolaire } from '../../Admin/Models/School-info';
import { SchoolService } from '../../Services/school.service';
import { AdminUSER } from '../../Admin/Models/Auth';

@Component({
  selector: 'app-class-students',
  templateUrl: './class-students.component.html',
  styleUrl: './class-students.component.css'
})
export class ClassStudentsComponent implements OnInit {

  searchTerm: string = ""
  classRoms: ClassRoom[] = [];
  classesArchives: ClassRoom[] = [];
  filteredClasse: ClassRoom[] = [];
  idNivFiliere!: number;
  annees: AnneeScolaire [] = []

  currentYear!: number

  classeSelect!: ClassRoom | null 

  // ueList: any[] = [];
  list_checked: any[] = [];
  isDesabled: boolean = false;
  isShow_add_module: boolean = false
  notFund_modal: boolean = true
  isShow_link_modal: boolean = true
  isShow_views_ues: boolean = false
  addModules!: FormGroup;
  classes_L1: ClassRoom[] = []
  classes_L2: ClassRoom[] = []
  classes_L3: ClassRoom[] = []
  permission: boolean = false

  constructor(private service: ClassStudentService, private sideBarService: SideBarService,
    private toastr: ToastrService, private infoSchool: SchoolService,
    private router: Router, public icons: IconsService) {

  }
  ngOnInit() {
    this.getPermission();
    this.loadClasses();
    this.get_annees();
    const date = new Date();
    this.currentYear = date.getFullYear();

    this.sideBarService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      console.log(this.searchTerm, "search")
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

  //get all classRoom
  loadClasses(): void {

    this.service.getAllCurrentClassOfYear().subscribe((classRoms: ClassRoom[]) => {

      this.classRoms = classRoms;
      console.log(classRoms, "classroom")

      this.classes_L1 = classRoms.filter(clr => clr.idFiliere?.idNiveau.nom === "LICENCE 1");
      console.log(this.classes_L1, "L1")
      this.classes_L2 = classRoms.filter(clr => clr.idFiliere?.idNiveau.nom === "LICENCE 2");
      this.classes_L3 = classRoms.filter(clr => clr.idFiliere?.idNiveau.nom === "LICENCE 3");

    });
  }
  
  // ------------------------------------------get all ue by class id
  getAll_ues(classe: ClassRoom) {
    this.isShow_add_module = true;
    this.isShow_link_modal = false
    this.classeSelect = classe


  }
  // -----------------------------------------method de condition de navigation
  show_views(classe: ClassRoom) {
    console.log(classe, "dois etre changer")
    if (this.classeSelect === classe) {
      this.classeSelect = null; // Deselect if already selected
    } else {
      this.classeSelect = classe; // Select the clicked item

    }

    this.service.getAllArchivesByClasseIdNivFil(classe.idFiliere?.id!).subscribe(result => {
      this.classesArchives = result
      console.log(this.classesArchives, "arch99999999999999")
    })
  }
  // ---------------------get permission to access
  getPermission(): boolean {
    const autorize = AdminUSER()?.scolarite;
    if (autorize) {
      this.permission = true
      console.log(autorize, "autorize")
      return true;
    }
    return false
  }

  toggle_to_view_ues(classe: ClassRoom) {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: classe.idFiliere?.id }

    }
    this.router.navigate(['/r-scolarite/view-ues'], navigationExtras)

  }
  archive(classe: ClassRoom) {
    console.log(classe, "archive----------------s")
    const navigationExtras: NavigationExtras = {
      queryParams: { id: classe.idFiliere?.id }

    }
    if(this.getPermission()){
    this.router.navigate(['/r-scolarite/class-archives'], navigationExtras)

    }else{
    this.router.navigate(['/dga/class-archives'], navigationExtras)

    }

  }
  // ----------------------- method go to add notes aux student
  toggle_to_notes(idClasse: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idClasse }
    };
    if (this.getPermission()) {
      console.log("scolarite")
      this.router.navigate(['/r-scolarite/student-notes'], navigationExtras);
    } else {
      console.log("dga")
      this.router.navigate(['/dga/student-notes'], navigationExtras);

    }

  }

  //hover bottom button 
  toggle_to_noteSemestre(idClasse: number, idNivFiliere: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idClasse, idNivFiliere: idNivFiliere },
    };
    const dga = AdminUSER()?.dga
    if (this.getPermission()) {
      this.router.navigate(['/r-scolarite/all-notes'], navigationExtras);

    } else if(dga) {
      this.router.navigate(['/dga/all-notes'], navigationExtras);
    }else{
      this.router.navigate(['/sidebar/all-notes'], navigationExtras);

    }
  }

  //link go to list students by class
  toggle_toStudentClasse(idClasse: number, idNivFiliere: number) {

    const navigationExtras: NavigationExtras = {
      queryParams: { id: idClasse, idNivFil: idNivFiliere }
    };
    const dga = AdminUSER()?.dga
    if (this.getPermission()) {
      this.router.navigate(['/r-scolarite/etudiant-de-la-classe'], navigationExtras);
    } else if(dga){
      this.router.navigate(['/dga/etudiant-de-la-classe'], navigationExtras);

    }else{
      this.router.navigate(['/sidebar/etudiant-de-la-classe'], navigationExtras);
      
    }
  }
  // ----------------------------------------lint to go to the param
  goToParamettre() {
    this.router.navigate(['/dga/setting']);
  }


  closeOverlay() {
    this.isShow_add_module = false
    this.isShow_link_modal = true
  }
  // ----------------------filtered 
  filterClasse_L1() {
    if (!this.searchTerm) {
      return this.filteredClasse = this.classes_L1;
    }
    return this.filteredClasse = this.classes_L1.filter(clf => clf.idFiliere?.idFiliere.nomFiliere.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      clf.idFiliere?.idNiveau.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      this.abreviateFiliereName(clf.idFiliere?.idFiliere.nomFiliere.toLowerCase()!).toLowerCase().includes(this.searchTerm.toLowerCase())
    )
      
  }
  filterClasse_L2() {
    if (!this.searchTerm) {
      return this.filteredClasse = this.classes_L2;
    }
    return this.filteredClasse = this.classes_L2.filter(clf => clf.idFiliere?.idFiliere.nomFiliere.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      clf.idFiliere?.idNiveau.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      this.abreviateFiliereName(clf.idFiliere?.idFiliere.nomFiliere.toLowerCase()!).toLowerCase().includes(this.searchTerm.toLowerCase())
    )
  }
  filterClasse_L3() {
    if (!this.searchTerm) {
      return this.filteredClasse = this.classes_L3;
    }
    return this.filteredClasse = this.classes_L3.filter(clf => clf.idFiliere?.idFiliere.nomFiliere.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      clf.idFiliere?.idNiveau.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      this.abreviateFiliereName(clf.idFiliere?.idFiliere.nomFiliere.toLowerCase()!).toLowerCase().includes(this.searchTerm.toLowerCase())
    )
  }

  // ------------------methode to abrevigate
  abreviateFiliereName(nom : string) : string{
    const wordAbreviate = nom.split(' ');
    const word = wordAbreviate.filter(w => w.length > 3).map(w => w[0].toUpperCase()).join('');
    return word;
    
  }
   // -------------------------get annees
   get_annees(){
    this.infoSchool.getAll_annee().subscribe(data =>{
      this.annees = data;
      this.annees.forEach(ans=>{
        const annee = new Date(ans.debutAnnee)
        const debutAnnee = annee.getFullYear()
        ans.ans = debutAnnee
      })
    })
  }

  promoSelect(event: any){
    
    const idAnnee = event.target.value

    this.service.getAllClasse(idAnnee).subscribe(classRoms =>{
      this.classRoms = []
      this.classRoms = classRoms;
      console.log(this.classRoms, "is class selectm list")

      this.classes_L1 = classRoms.filter(clr => clr.idFiliere?.idNiveau.nom === "LICENCE 1");
      this.classes_L2 = classRoms.filter(clr => clr.idFiliere?.idNiveau.nom === "LICENCE 2");
      this.classes_L3 = classRoms.filter(clr => clr.idFiliere?.idNiveau.nom === "LICENCE 3");
    })
  }

}

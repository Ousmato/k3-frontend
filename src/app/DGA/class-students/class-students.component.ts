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

  searchTerm: string = ""
  classRoms: ClassRoom[] = [];
  classesArchives: ClassRoom[] = [];
  filteredClasse: ClassRoom[] = [];
  idNivFiliere!: number;

  classeSelect!: ClassRoom | null 

  ueList: any[] = [];
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
    private toastr: ToastrService,
    private router: Router, public icons: IconsService) {

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

  // ------------------------------------------get all classRoom
  loadClasses(): void {

    this.service.getAllCurrentClassOfYear().subscribe((classRoms: ClassRoom[]) => {

      this.classRoms = classRoms;
      console.log(classRoms, "classroom")

      this.classes_L1 = classRoms.filter(clr => clr.idFiliere?.idNiveau.nom === "LICENCE 1");
      this.classes_L2 = classRoms.filter(clr => clr.idFiliere?.idNiveau.nom === "LICENCE 2");
      this.classes_L3 = classRoms.filter(clr => clr.idFiliere?.idNiveau.nom === "LICENCE 3");

    });
  }
  // ----------------------------------------add module in classRoom
  createClassModule(classe: any) {

    const idClass: ClassRoom = this.classRoms.find(cl => cl.id === classe.id)!;


    const ues: ClassModules = {
      idStudentClasse: idClass,
      idUE: this.list_checked,

    }
    this.service.createClassModule(ues).subscribe({
      next: (response) => {
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
      // console.log(this.classesArchives, "arch99999999999999")
    })
  }
  // ---------------------get permission to access
  getPermission(): boolean {
    const autorize = sessionStorage.getItem('scolarite');
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
  //  -------------------------hover bottom button 
  toggle_to_noteSemestre(idClasse: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idClasse }
    };
    if (this.getPermission()) {
      this.router.navigate(['/r-scolarite/all-notes'], navigationExtras);

    } else {
      this.router.navigate(['/dga/all-notes'], navigationExtras);
    }

  }
  // ------------------------------link go to list students by class
  toggle_to_presence(idClasse: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idClasse }
    };
    if (this.getPermission()) {
      this.router.navigate(['/r-scolarite/etudiant-de-la-classe'], navigationExtras);
    } else {
      this.router.navigate(['/dga/etudiant-de-la-classe'], navigationExtras);

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
      clf.idFiliere?.idNiveau.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()))
  }
  filterClasse_L2() {
    if (!this.searchTerm) {
      return this.filteredClasse = this.classes_L2;
    }
    return this.filteredClasse = this.classes_L1.filter(clf => clf.idFiliere?.idFiliere.nomFiliere.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      clf.idFiliere?.idNiveau.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()))
  }
  filterClasse_L3() {
    if (!this.searchTerm) {
      return this.filteredClasse = this.classes_L3;
    }
    return this.filteredClasse = this.classes_L1.filter(clf => clf.idFiliere?.idFiliere.nomFiliere.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      clf.idFiliere?.idNiveau.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()))
  }
}

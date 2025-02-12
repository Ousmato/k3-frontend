import { Component, HostListener, OnInit } from '@angular/core';
import { EtudeService } from '../etude.service';
import { ClassStudentService } from '../../../../DGA/class-students/class-student.service';
import { IconsService } from '../../../../Services/icons.service';
import { Inscription, Student } from '../../../Models/Students';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { StudentPages } from '../../../Models/Pagination-module';
import { SideBarService } from '../../../../sidebar/side-bar.service';
import { environment } from '../../../../../environments/environment';
import { Admin } from '../../../Models/Admin';
import { AdminUSER } from '../../../Models/Auth';
import { ClassRoom } from '../../../Models/Classe';
import { InscriptionService } from '../../../../Services/inscription.service';
import { PageTitleService } from '../../../../Services/page-title.service';
import { Class_shared } from '../../../../DGA/class-students/Utils/Class-shared-methods';
import { StudentSharedMethods } from '../Utils/Student-shared-methode';

@Component({
  selector: 'app-etudiants-de-la-classe',
  templateUrl: './etudiants-de-la-classe.component.html',
  styleUrl: './etudiants-de-la-classe.component.css'
})
export class EtudiantsDeLaClasseComponent implements OnInit{
  
  searchTerm: string = '';
  inscrits: Inscription[] = [];
  // students!: Student [];
  student!: Student;
  idClasse !: number
  idSouFiiere !: number | null
  indexSelect !: number | null
  idInscritSelect !: number | null
  Classe !: ClassRoom

  adminDga!: Admin
  studentspage?: StudentPages;
  page = 0;
  size = 100;
  filteredItems : Inscription[] = []
  pages: number[] = []
  permission : boolean =false
  
  constructor(private service: EtudeService, private route: ActivatedRoute, public sharedMethod: StudentSharedMethods, 
    private router: Router, private pageTitle: PageTitleService,
    private sideBarService: SideBarService, public icons: IconsService, private inscriptionService: InscriptionService, public shared_methode: Class_shared) { }

  ngOnInit(): void {
    this.loadStudents();

    this.adminDga = AdminUSER()?.dga;
    this.sideBarService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterStudents();
    
    });
  }

  // ------------------------------------------load student by class id
  loadStudents(): void {
    this.route.queryParams.subscribe(param =>{
      // if(param[''])
          this.idClasse = param['id']
        })
    this.service.getStudent_ByIdClasse(this.page, this.size, this.idClasse).subscribe(data => {
      this.inscrits = data.content;
      // console.log(this.students, "student of classe")
      this.inscrits.forEach((item : Inscription) => {
        item.idEtudiant.urlPhoto = `${environment.urlPhoto}${item.idEtudiant.urlPhoto}`;
      })
      this.studentspage = data;
      this.filteredItems = this.inscrits;
      this.pages = Array.from({ length: data.totalPages! }, (_, i) => i);

      this.Classe = this.inscrits[0].idClasse;
      console.log(this.inscrits, "inscrit of class")
    });
  }

  // --------------------------filter methode
  filterStudents() {
    if (!this.searchTerm) {
     return this.filteredItems = this.inscrits;
    } else {
    return  this.filteredItems = this.inscrits.filter(inst =>
        inst.idEtudiant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inst.idEtudiant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inst.idEtudiant.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  // ------------------------go back to previous page
  goBack() {
    window.history.back();
  }
  
    //  -------------------------------load bulletin
    load_bulletin(idStudent: number){
      const navigationExtrat: NavigationExtras = {
        queryParams: {
          id: idStudent
        }

      }
      
      
      if(AdminUSER()?.dg){
      this.router.navigate(['/sidebar/student-bulletin'], navigationExtrat);

      }else{
      this.router.navigate(['/r-scolarite/student-bulletin'], navigationExtrat);

      }

   
    }
  // --------------------------------buttons pagination
  setPage(page: number): void {
    if (page >= 0 && page < this.studentspage!.totalPages!) {
      this.page = page;
      this.loadStudents();
    }
  }

  nextPage(): void {
    if (this.page < this.studentspage!.totalPages! - 1) {
      this.setPage(this.page + 1);
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.setPage(this.page - 1);
    }
  }

  getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    const totalPages = this.studentspage!.totalPages!;

    const startPage = Math.max(0, this.page - 1); // Une page avant la courante
    const endPage = Math.min(totalPages - 1, this.page + 1); // Une page après la courante

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  }

  // get classe 
  getSpecialite(idSpecialite: number, index: number){
    this.indexSelect = index;
    this.idSouFiiere = idSpecialite;
    this.inscriptionService.getInscriptionsByidSousFiliere(idSpecialite).subscribe(data =>{
      this.inscrits = data.inscriptions;
    })
  }

  show_specialite( idInscrit: number){
    if(this.idInscritSelect == null){
    this.idInscritSelect = idInscrit;
    }else{
      this.idInscritSelect = null;
    }
  }

  allInscrit(){
    this.loadStudents();
    this.idSouFiiere = null;
  }

  filiere_check(idSouFiliere: number, event: any){
    if(event.target.checked){
      console.log(idSouFiliere, "check idSouFiliere")
      // return
      this.inscriptionService.addInscriptionsToSubfilieres(this.idInscritSelect!, idSouFiliere).subscribe({
        next: (data) => {
          this.pageTitle.showSuccessToast(data.message)
          this.idInscritSelect = null
          this.loadStudents();
        },
        error: (error) => {
          this.pageTitle.showErrorToast(error.error.message)
        }
      })
      
    }
  }

}

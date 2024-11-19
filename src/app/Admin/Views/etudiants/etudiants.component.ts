import { Component, OnInit } from '@angular/core';
import { EtudeService } from './etude.service';
import { Inscription, Student, StudentEtat } from '../../Models/Students';
import { IconsService } from '../../../Services/icons.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Route, Router } from '@angular/router';
import { PageTitleService } from '../../../Services/page-title.service';
import { StudentPages, TeacherPages } from '../../Models/Pagination-module';
import { SideBarService } from '../../../sidebar/side-bar.service';
import { Admin, adminEtat } from '../../Models/Admin';
import { SchoolService } from '../../../Services/school.service';
import { AnneeScolaire } from '../../Models/School-info';
import { environment } from '../../../../environments/environment';
import { AdminUSER } from '../../Models/Auth';

@Component({
  selector: 'app-etudiants',
  templateUrl: './etudiants.component.html',
  styleUrl: './etudiants.component.css'
})
export class EtudiantsComponent implements OnInit {

  searchTerm: string = '';
  inscrits: Inscription[] = [];

  studentspage?: StudentPages;
  page = 0;
  size = 20;
  filteredItems: Inscription[] = []
  pages: number[] = []

  // admin!: Admin
  dg!: Admin
  secretaire!: Admin
  permission: boolean = false
  event_toSetPage: boolean = false
  student!: Student;
  currentYear!: number
  idAnnee!: number
  value_toEvent: any = 0
  annees: AnneeScolaire[] = []
  student_etats: { key: string, value: any }[] = []
  // urlImage!: string | ArrayBuffer

  constructor(private service: EtudeService, private sideBarService: SideBarService, private route: ActivatedRoute,
    private root: Router, public icons: IconsService, private pageTitle: PageTitleService, private infoSchool: SchoolService) { }

  ngOnInit(): void {
    this.getPermission();
    this.loadStudents();
    this.get_annees();
   
    this.student_etats = this.getStudentEtat();
    this.currentYear = new Date().getFullYear()
    this.sideBarService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterStudents();


    });
  }
  // ----------------------------------get permission
  getPermission(): boolean {
    const autorize = AdminUSER()?.scolarite;
    this.dg = AdminUSER()?.dg;
    this.secretaire = AdminUSER()?.secretaire;
    if (autorize) {
      // console.log(autorize, "autorize")
      this.permission = true
      return true;
    }
    return false
  }
  // ------------------------------filter students
  filterStudents() {
    if (!this.searchTerm) {
      return this.filteredItems = this.inscrits;
    } else {
      return this.filteredItems = this.inscrits.filter(inst =>
        inst.idEtudiant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inst.idEtudiant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inst.idEtudiant.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inst.idEtudiant.idClasse?.idFiliere?.idFiliere.nomFiliere.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inst.idEtudiant.idClasse?.idFiliere?.idNiveau.nom?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  // ----------------------load students
  onChange(event: any) {
    this.event_toSetPage = true
    this.inscrits = []
    this.page = 0
    this.idAnnee = event.target.value
    this.service.getAll_by_idAnnee(this.idAnnee, this.page, this.size).subscribe(data => {
      this.formatedDataStudent(data);

    });
  }
  loadStudents(): void {
    this.service.getSudents(this.page, this.size).subscribe(data => {
      this.formatedDataStudent(data);

    });
  }
  // ------------------------------next page
  setPage(page: number): void {
    if (page >= 0 && page < this.studentspage!.totalPages!) {
      this.page = page;
      if (this.event_toSetPage) {
        this.service.getAll_by_idAnnee(this.idAnnee, this.page, this.size).subscribe(data => {
          this.formatedDataStudent(data);

        });
        this.event_toSetPage = false;
        return
      }

      if (this.value_toEvent === 0 || this.value_toEvent === StudentEtat.Tout) {
        console.log("la page selectionner", page)
        this.loadStudents();

      } else {
        this.service.getByEtat(this.value_toEvent, this.page, this.size).subscribe(data => {
          this.formatedDataStudent(data)
        })

      }

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
  // ------------------------------pages visibles
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
  // ------------------------------------------------------------
  get_annees() {
    this.infoSchool.getAll_annee().subscribe(data => {
      this.annees = data;
      this.annees.forEach(ans => {
        const annee = new Date(ans.debutAnnee)
        const debutAnnee = annee.getFullYear()
        ans.ans = debutAnnee
      })
    })
  }
  // ------------------------------------------------------------
  getStudent(inscrit?: Inscription) {

    const navigationExtras: NavigationExtras = {
      queryParams: { id: inscrit!.id }
    };
    const comptable = AdminUSER()?.comptable
    // const scolarite = sessionStorage.getItem('scolarite')
    if (comptable) {
      this.root.navigate(['/comptable/student-view'], navigationExtras)
    } else {
      this.root.navigate(['/r-scolarite/student-edit'], navigationExtras)
    }
    // this.root.navigate(['/r-scolarite/student-edit'], navigationExtras)
  }

  // ------------------------------------------------------------
  getStudentView(idInscription: number) {

    const navigationExtras: NavigationExtras = {
      queryParams: { id: idInscription }
    };
    this.root.navigate(['/secretaire/student-view'], navigationExtras)
  }
  // ----------------------------------------------------------
  deleted_student(id: number) {
    this.service.desactiveStudent(id).subscribe(
      {
        next: (response) => {
          this.pageTitle.showSuccessToast(response.message);
        },
        error: (erreur) => {
          this.pageTitle.showErrorToast(erreur.error.message);
        }
      }
    )
  }
  // -----------------------
  getStudentEtat(): { key: string, value: any }[] {
    return Object.keys(StudentEtat)
      .filter(key => isNaN(Number(key))) // Filtrer pour obtenir seulement les clés
      .map(key => ({
        key: key, // La clé (nom de l'état)
        value: StudentEtat[key as keyof typeof StudentEtat] // La valeur correspondante
      }));
  }

  getEtat(event: any) {
    this.inscrits = []
    this.value_toEvent = event.target.value;
    if (this.value_toEvent === StudentEtat.Tout) {
      this.loadStudents();
    } else {
      this.page = 0
      // console.log(this.value_toEvent, "value",  this.page, "page",  this.size, "size")
      this.service.getByEtat(this.value_toEvent, this.page, this.size).subscribe(data => {
        this.formatedDataStudent(data)
      })

    }


  }

  // --------------
  formatedDataStudent(data: StudentPages) {
    this.inscrits = data.content;
    this.inscrits.forEach((item: Inscription) => {
      item.idEtudiant.urlPhoto = `${environment.urlPhoto}${item.idEtudiant.urlPhoto}`;
    })
    this.studentspage = data;
    this.filteredItems = this.inscrits;
    this.pages = Array.from({ length: data.totalPages! }, (_, i) => i);
    console.log(this.pages, "pages")
  }
  // ----------------------abrevigate filiere name
  abreviateFiliereName(filiere: string): string {
    const nameWord = filiere.split(' ');
    const word = nameWord.filter(wd => wd.length > 3).map(word => word[0].toUpperCase()).join('')
    return word;
  }



}

import { Component, OnInit } from '@angular/core';
import { EtudeService } from './etude.service';
import { Student } from '../../Models/Students';
import { IconsService } from '../../../Services/icons.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Route, Router } from '@angular/router';
import { PageTitleService } from '../../../Services/page-title.service';
import { StudentPages, TeacherPages } from '../../Models/Pagination-module';
import { SideBarService } from '../../../sidebar/side-bar.service';
import { Admin } from '../../Models/Admin';
import { SchoolService } from '../../../Services/school.service';
import { AnneeScolaire } from '../../Models/School-info';

@Component({
  selector: 'app-etudiants',
  templateUrl: './etudiants.component.html',
  styleUrl: './etudiants.component.css'
})
export class EtudiantsComponent implements OnInit {

  searchTerm: string = '';
  students: Student[] = [];

  studentspage?: StudentPages;
  page = 0;
  size = 20;
  filteredItems: Student[] = []
  pages: number[] = []

  admin!: Admin
  permission: boolean = false
  student!: Student;
  currentYear!: number
  annees: AnneeScolaire[] = []

  // urlImage!: string | ArrayBuffer

  constructor(private service: EtudeService, private fb: FormBuilder, private sideBarService: SideBarService,
    private root: Router, public icons: IconsService, private pageTitle: PageTitleService, private infoSchool: SchoolService) { }

  ngOnInit(): void {
    this.getPermission();
    this.loadStudents();
    this.get_annees();
    this.currentYear = new Date().getFullYear()
    this.sideBarService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterStudents();


    });
  }
  // ----------------------------------get permission
  getPermission(): boolean {
    const autorize = sessionStorage.getItem('scolarite');
    if (autorize) {
      this.permission = true
      return true;
    }
    return false
  }
  // ------------------------------filter students
  filterStudents() {
    if (!this.searchTerm) {
      return this.filteredItems = this.students;
    } else {
      return this.filteredItems = this.students.filter(student =>
        student.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.idClasse.idFiliere?.idFiliere.nomFiliere.toLowerCase().includes(this.searchTerm.toLowerCase())||
        student.idClasse.idFiliere?.idNiveau.nom?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  // ----------------------load students
  onChange(event: any){

  }
  loadStudents(): void {
    this.service.getSudents(this.page, this.size).subscribe(data => {
      this.students = data.content;
      this.students.forEach((item: Student) => {
        item.urlPhoto = `http://localhost/StudentImg/${item.urlPhoto}`;
      })
      this.studentspage = data;
      this.filteredItems = this.students;
      this.pages = Array.from({ length: data.totalPages! }, (_, i) => i);
      console.log(this.pages, "pages")

    });
  }
  // ------------------------------next page
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
  getStudent(student?: Student) {

    const navigationExtras: NavigationExtras = {
      queryParams: { id: student?.idEtudiant }
    };
    const comptable = sessionStorage.getItem('comptable')
    // const scolarite = sessionStorage.getItem('scolarite')
    if (comptable) {
      this.root.navigate(['/comptable/student-view'], navigationExtras)
    } else {
      this.root.navigate(['/r-scolarite/student-edit'], navigationExtras)
    }
    // this.root.navigate(['/r-scolarite/student-edit'], navigationExtras)
  }

  // ------------------------------------------------------------
  getStudentView(student: Student) {

    const navigationExtras: NavigationExtras = {
      queryParams: { id: student?.idEtudiant }
    };
    const comptable = sessionStorage.getItem('comptable')
    const secretaire = sessionStorage.getItem('secretaire')
    if (comptable) {
      this.root.navigate(['/comptable/student-view'], navigationExtras)

    } else if (secretaire) {
      this.root.navigate(['/secretaire/student-view'], navigationExtras)
    } else {
      this.root.navigate(['/r-scolarite/student-view'], navigationExtras)
    }
    // this.root.navigate(['/r-scolarite/student-view'], navigationExtras)
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


}

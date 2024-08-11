import { Component, OnInit } from '@angular/core';
import { EtudeService } from './etude.service';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { Student } from '../../Models/Students';
import { data } from 'jquery';
import { IconsService } from '../../../Services/icons.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dom } from '@fortawesome/fontawesome-svg-core';
import { ActivatedRoute, NavigationExtras, Route, Router } from '@angular/router';
import { PageTitleService } from '../../../Services/page-title.service';
import { StudentPages, TeacherPages } from '../../Models/Pagination-module';
import { SideBarService } from '../../../sidebar/side-bar.service';

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
  size = 10;
  filteredItems : Student[] = []
  pages: number[] = []
  
  update_student_form!: FormGroup
  student!: Student;
  fileName!: File
  photoSelect!: File
  urlImage! : string | ArrayBuffer
  
  constructor(private service: EtudeService,private fb: FormBuilder, private sideBarService: SideBarService,
    private root: Router, public icons: IconsService, private pageTitle : PageTitleService) { }

  ngOnInit(): void {
    
   this.loadStudents();
    this.load_student_form();
    this.sideBarService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterStudents();
    
    });
  }
  // ------------------------------filter students
  filterStudents() {
    if (!this.searchTerm) {
     return this.filteredItems = this.students;
    } else {
    return  this.filteredItems = this.students.filter(student =>
        student.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.idClasse.idFiliere?.idFiliere.nomFiliere.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  // ----------------------load students
  loadStudents(): void {
    this.service.getSudents(this.page, this.size).subscribe(data => {
      this.students = data.content;
      this.students.forEach((item : Student) => {
        item.urlPhoto = `http://localhost/StudentImg/${item.urlPhoto}`;
      })
      this.studentspage = data;
      this.filteredItems = this.students;
      this.pages = Array.from({ length: data.totalPages! }, (_, i) => i);

      console.log(this.students, "pagenation teachers")
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
  // ----------------------------refresh page
  refresh(){
    this.loadStudents();
  }
// -----------------------------------------------load form update student
  load_student_form(){
    this.update_student_form = this.fb.group({
       // id: [null], 
       nom: ['', Validators.required],
       prenom: ['', Validators.required],
       sexe: ['', Validators.required],
       email: ['', [Validators.required, Validators.email]],
       telephone: ['', Validators.required],
       password: ['', Validators.required],
       urlPhoto: ['',Validators.required],
       matricule: ['', Validators.required],
       scolarite: ['', Validators.required],
       // date: [''],
       idClasse: [],
       lieuNaissance: ['',Validators.required],
       dateNaissance: ['',Validators.required],
       active: [false],
       admin: [] 
    })
  }
  // ----------------------------------------------------
  onPhotoSelected(event: any){
    
    console.log(this.fileName, "fill")
    this.photoSelect = event.target.files[0];
    // console.log(this.photoSelect, "photo select")
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.urlImage = e.target.result;
    };
    reader.readAsDataURL(this.photoSelect);
  }
  update_student(student: Student){}
  // ------------------------------------------------------------
  getStudent(student?: Student) {
    
    const navigationExtras: NavigationExtras = {
      queryParams: { id: student?.idEtudiant }
    };
    this.root.navigate(['/r-scolarite/student-edit'], navigationExtras)
  }

  // ------------------------------------------------------------
  getStudentView(student: Student){
    
    const navigationExtras: NavigationExtras = {
      queryParams: { id: student?.idEtudiant }
    };
    this.root.navigate(['/r-scolarite/student-view'], navigationExtras)
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
  // ------------------------------filter methode
  //  filteredStudents() {
  //   if (!this.searchTerm) {
  //     return this.students;
  //   }
  //   return this.students.filter(student =>
  //     student.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //     student.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //     student.idClasse.idFiliere?.idFiliere?.nomFiliere.toLowerCase().includes(this.searchTerm.toLowerCase())
  //     // student.telephone.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  // }
}

import { Component, OnInit } from '@angular/core';
import { Student } from '../../Admin/Models/Students';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EtudeService } from '../../Admin/Views/etudiants/etude.service';
import { IconsService } from '../../Services/icons.service';
import { PageTitleService } from '../../Services/page-title.service';
import { SideBarService } from '../../sidebar/side-bar.service';
import { Admin } from '../../Admin/Models/Admin';
import { StudentPages } from '../../Admin/Models/Pagination-module';

@Component({
  selector: 'app-r-s-reinscription',
  templateUrl: './r-s-reinscription.component.html',
  styleUrl: './r-s-reinscription.component.css'
})
export class RSReinscriptionComponent  implements OnInit{

  searchTerm: string = '';
  students: Student[] = [];
  path_url!: string

  studentspage?: StudentPages;
  page = 0;
  size = 10;
  filteredItems : Student[] = []
  pages: number[] = []
  
  admin!: Admin
  idAnne!: number
  permission: boolean = false
  is_show: boolean = false
  update_student_form!: FormGroup
  student!: Student;
  fileName!: File
  photoSelect!: File
  urlImage! : string | ArrayBuffer
  
  constructor(private service: EtudeService,private rout: ActivatedRoute, private sideBarService: SideBarService,
    private rooter: Router, public icons: IconsService, private pageTitle : PageTitleService) { }

  ngOnInit(): void {
    this.getPermission();
   this.loadStudents();
    this.sideBarService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterStudents();
    
    });
  }
// ----------------------------------get permission
  getPermission(): boolean {
    const autorize = sessionStorage.getItem('scolarite');
    if(autorize){
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
    this.rout.queryParams.subscribe(param=>{
      this.idAnne = +param['id']
    })
    this.service.getAll_by_idAnnee(this.idAnne, this.page, this.size).subscribe(data => {
      this.students = data.content;
      this.students.forEach((item : Student) => {
        this.path_url = item.urlPhoto!
        item.urlPhoto = `http://localhost/StudentImg/${item.urlPhoto}`;
      })
      this.studentspage = data;
      this.filteredItems = this.students;
      this.pages = Array.from({ length: data.totalPages! }, (_, i) => i);

      this.extractUniqueStudents(this.students)
      // console.log(this.students, "pagenation teachers")
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
  
// -----------------------------------------------load form update student
 

  // ------------------------------------------------------------
  getStudentView(student: Student){
   const url = this.extractFileName(student.urlPhoto!);
    student.urlPhoto = url
   this.student = student
    this.is_show =! this.is_show
    // const navigationExtras: NavigationExtras = {
    //   queryParams: { id: student?.idEtudiant }
    // };
    // const comptable = sessionStorage.getItem('comptable')
    // const secretaire = sessionStorage.getItem('secretaire')
    // if(comptable){
    //   this.root.navigate(['/comptable/student-view'], navigationExtras)

    // }else if(secretaire){
    //   this.root.navigate(['/secretaire/student-view'], navigationExtras)
    // }else{
    //   this.root.navigate(['/r-scolarite/student-view'], navigationExtras)
    // }
    // this.root.navigate(['/r-scolarite/student-view'], navigationExtras)
  }

  extractFileName(url: string): string {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    return path.substring(path.lastIndexOf('/') + 1);
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
 
  // ----------------------------------extration 
  private extractUniqueStudents(notes: Student[]): Student[] {
    const uniqueStudents = new Set<number>(); // Utilise un Set pour stocker les idEtudiant uniques
    const result: Student[] = [];
    
    notes.forEach(item => {
      if (!uniqueStudents.has(item.idEtudiant!)) { // Vérifie si l'idEtudiant n'est pas déjà dans le Set
        uniqueStudents.add(item.idEtudiant!); 
        result.push(item); // Ajoute l'étudiant au tableau résultant des étudiants uniques
      }
    });
    result.forEach((student, index) => {
      student.numero = index + 1; // Ajoute 1 pour commencer à partir de 1 (si nécessaire)
    });

    return result;
  }

  // ------------------close modal
  closeModal() {
    this.is_show = false;
  }

  // -------------------------go back
  goBack(){
    window.history.back();
  }
}
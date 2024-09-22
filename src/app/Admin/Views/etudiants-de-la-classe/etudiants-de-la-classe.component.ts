import { Component, OnInit } from '@angular/core';
import { EtudeService } from '../etudiants/etude.service';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { IconsService } from '../../../Services/icons.service';
import { Student } from '../../Models/Students';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { StudentPages } from '../../Models/Pagination-module';
import { SideBarService } from '../../../sidebar/side-bar.service';

@Component({
  selector: 'app-etudiants-de-la-classe',
  templateUrl: './etudiants-de-la-classe.component.html',
  styleUrl: './etudiants-de-la-classe.component.css'
})
export class EtudiantsDeLaClasseComponent implements OnInit{
  
  searchTerm: string = '';
  students: Student[] = [];
  // students!: Student [];
  student!: Student;
  idClasse !: number

  studentspage?: StudentPages;
  page = 0;
  size = 10;
  filteredItems : Student[] = []
  pages: number[] = []
  permission : boolean =false
  
  constructor(private service: EtudeService, private route: ActivatedRoute, private router: Router,
    private sideBarService: SideBarService, public icons: IconsService) { }

  ngOnInit(): void {
    this.loadStudents();

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
      this.students = data.content;
      // console.log(this.students, "student of classe")
      this.students.forEach((item : Student) => {
        item.urlPhoto = `http://localhost/StudentImg/${item.urlPhoto}`;
      })
      this.studentspage = data;
      this.filteredItems = this.students;
      this.pages = Array.from({ length: data.totalPages! }, (_, i) => i);

      // console.log(this.students, "pagenation teachers")
      this.extractUniqueStudents(this.students)
    });
  }

  // --------------------------filter methode
  filterStudents() {
    if (!this.searchTerm) {
     return this.filteredItems = this.students;
    } else {
    return  this.filteredItems = this.students.filter(student =>
        student.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  // ------------------------go back to previous page
  goBack() {
    window.history.back();
  }
  // ------------------------get permission
  getPermission(): boolean {
    const autorize = sessionStorage.getItem('dga');
    if(autorize){
     this.permission = true
      return true;
    }
    return false
  }
    //  -------------------------------load bulletin
    load_bulletin(idStudent: number){
      const navigationExtrat: NavigationExtras = {
        queryParams: {
          id: idStudent
        }

      }
      if(this.getPermission()){
        this.router.navigate(['/dga/student-bulletin'], navigationExtrat);
      }else{
        this.router.navigate(['/r-scolarite/student-bulletin'], navigationExtrat)
      }
      
   
    }
// -------------------------methode to cunt student order number
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
}

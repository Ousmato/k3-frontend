import { Component, OnInit } from '@angular/core';
import { EtudeService } from '../etudiants/etude.service';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { IconsService } from '../../../Services/icons.service';
import { Student } from '../../Models/Students';
import { ActivatedRoute } from '@angular/router';
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
  
  constructor(private service: EtudeService, private route: ActivatedRoute,
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
          this.idClasse = param['id']
        })
    this.service.getStudent_ByIdClasse(this.page, this.size, this.idClasse).subscribe(data => {
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

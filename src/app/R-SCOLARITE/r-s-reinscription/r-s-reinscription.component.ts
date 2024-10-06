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
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { ClassRoom } from '../../Admin/Models/Classe';
import { Niveau } from '../../Admin/Models/Niveau';

@Component({
  selector: 'app-r-s-reinscription',
  templateUrl: './r-s-reinscription.component.html',
  styleUrl: './r-s-reinscription.component.css'
})
export class RSReinscriptionComponent implements OnInit {

  searchTerm: string = '';
  students: Student[] = [];
  studentsInscrit: Student[] = [];
  idClasse!: any
  classRoom: ClassRoom[] = []
  niveau?: Niveau
  NextClassRoom: ClassRoom[] = []

  filteredItems: Student[] = []

  admin!: Admin
  idAnne!: number
  permission: boolean = false
  is_show: boolean = false
  update_student_form!: FormGroup
  classeStudent: Student[] = []
  student?: Student;

  constructor(private service: EtudeService, private rout: ActivatedRoute, private sideBarService: SideBarService,
    private classeService: ClassStudentService, public icons: IconsService, private pageTitle: PageTitleService) { }

  ngOnInit(): void {
    this.getPermission();
    // this.loadStudents();
    this.load_classes();
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
        student.idClasse.idFiliere?.idFiliere.nomFiliere.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }


  // -----------------------load all classe 

  load_classes() {
    this.rout.queryParams.subscribe(param => {
      this.idAnne = param['id']
    })
    this.classeService.getAllClasse(this.idAnne).subscribe(result => {
      this.classRoom = result;

      // console.log(this.classRoom, "88888888888888")
    })
  }

  // ------------------------------------------------------------
  getStudentView(student: Student) {
    this.is_show = true
    this.student = student
    console.log(this.student, "student 000")
    
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


  // ------------------close modal
  closeModal() {
    // this.ngOnInit();wi
    // window.location.reload()
    console.log("-------------------id select", this.idClasse)
    this.is_show = false;
  }

  // -------------------------go back
  goBack() {
    window.history.back();
  }
  changeClasse(event: any) {
    // console.log("0000000000000000-----------")
   this.idClasse = event.target.value;
    this.load_nextClasse(this.idClasse);
    this.rout.queryParams.subscribe(param => {
      this.idAnne = +param['id']
      // this.load_classes(idClasse);
    })

    this.service.getStudentListByIdAnneeAndIdClasse(this.idAnne, +this.idClasse).subscribe(data => {
      this.students = data
      
      this.filteredItems = this.students;
     
      console.log(this.students, "pagenation teachers")
    });

  }

  load_nextClasse(idClasse: number) {
    this.classeService.getNextClasseByIdPrevious(idClasse).subscribe(result => {
      this.NextClassRoom = result;
      console.log(result, "next class")

      this.NextClassRoom.forEach(ncls => {
        this.niveau = ncls.idFiliere?.idNiveau
        this.service.getStudentListByIdAnneeAndIdClasse(ncls.idAnneeScolaire?.id! ,ncls.id!).subscribe(result => {
          this.studentsInscrit = result
          console.log(this.studentsInscrit, "les incrits")
        })
      })
    })

  }
  // ----------------methode to compare liste studentInscrit and students
  check(matricule: string) {
    let index = this.studentsInscrit.findIndex(e => e.matricule == matricule);
    if (index != -1) {
      return true;
    } else {
      return false;
    }

  }

}

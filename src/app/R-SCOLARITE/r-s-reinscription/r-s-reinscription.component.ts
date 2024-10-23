import { Component, EventEmitter, OnInit } from '@angular/core';
import { Inscription, Student } from '../../Admin/Models/Students';
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
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-r-s-reinscription',
  templateUrl: './r-s-reinscription.component.html',
  styleUrl: './r-s-reinscription.component.css'
})
export class RSReinscriptionComponent implements OnInit {

  searchTerm: string = '';
  inscription: Inscription[] = [];
  studentsInscrit: Inscription[] = [];
  idClasse!: any
  classRoom: ClassRoom[] = []
  niveau?: Niveau
  NextClassRoom: ClassRoom[] = []
  NextClass!: ClassRoom
  newEvent = new EventEmitter<any>();

  filteredItems: Inscription[] = []

  admin!: Admin
  idAnne!: number
  permission: boolean = false
  is_show: boolean = false
  update_student_form!: FormGroup
  classeStudent: Student[] = []
  inscrit?: Inscription;

  constructor(private service: EtudeService, private rout: ActivatedRoute, private sideBarService: SideBarService,
    private classeService: ClassStudentService, public icons: IconsService, private router: Router,
    private pageTitle: PageTitleService) { }

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
    this.admin = JSON.parse(autorize!)
    if (autorize) {
      this.permission = true
      return true;
    }
    return false
  }
  // ------------------------------filter students
  filterStudents() {
    if (!this.searchTerm) {
      return this.filteredItems = this.inscription;
    } else {
      return this.filteredItems = this.inscription.filter(inscrit =>
        inscrit.idEtudiant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inscrit.idEtudiant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       
        inscrit.idClasse.idFiliere?.idFiliere.nomFiliere.toLowerCase().includes(this.searchTerm.toLowerCase())
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
    })
  }

  // ------------------------------------------------------------
  getStudentView(inscrit: Inscription) {
    this.is_show = true
    this.inscrit = inscrit
    this.inscrit.idEtudiant.urlPhoto = `${environment.urlPhoto}${inscrit.idEtudiant.urlPhoto}`
    console.log(this.inscrit, "student 000")
    
  }

 
  // -------------------reinscription
  confirmInscription(student: Inscription, idClasse: number){
    console.log(student, "innn------------------------")
    // return
    this.service.reInscriptionStudent(student!, idClasse!, this.admin.idAdministra!).subscribe({
      next: (result) => {
        this.pageTitle.showSuccessToast(result.message)
        // this.changeClasse(idClasse);
        
      },
      error: (error) => {
        this.pageTitle.showErrorToast(error.error.message)
      }
    })
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
  exitConfirm() {
    // this.ngOnInit();wi
    // window.location.reload()
    console.log("-------------------id select", this.idClasse)
    this.is_show = false;
  }

  // -------------------------go back
  goBack() {
    window.history.back();
  }
  changeClasse(eventOrIdClasse: any) {
   
      // Si c'est directement l'ID de la classe
      this.idClasse = eventOrIdClasse.target.value;
 
    this.rout.queryParams.subscribe(param => {
      this.idAnne = +param['id']
    })
    this.service.getStudentListByIdAnneeAndIdClasse(this.idAnne, +this.idClasse).subscribe(data => {
      this.inscription = data
      
      this.filteredItems = data;
     
      // console.log(this.inscription, "students")
    });
    this.load_nextClasse(this.idClasse);

  }

  load_nextClasse(idClasse: number) {
    this.classeService.getNextClasseByIdPrevious(idClasse).subscribe(result => {
      this.NextClassRoom = result;

      console.log(result, "next class")

      this.NextClassRoom.forEach(ncls => {
        this.NextClass = ncls
        this.niveau = ncls.idFiliere?.idNiveau
        this.service.getStudentListByIdAnneeAndIdClasse(ncls.idAnneeScolaire?.id! ,ncls.id!).subscribe(result => {
          this.studentsInscrit = result
          console.log(this.studentsInscrit, "les incrits")
        })
      })
    })

  }
  // ----------------methode to compare liste studentInscrit and students
  check(idInscription: number, active: boolean) {
    return this.studentsInscrit.some(e => e.idEtudiant.idEtudiant == idInscription && e.active == active);
    
  }

  // -----------------change state
  changeState(idEtudiant: number, idClasse: number) {
   const idInscription = this.studentsInscrit.find(si =>si.idEtudiant.idEtudiant == idEtudiant);
    this.service.changeStateStudentInscription(idInscription?.id!, idClasse).subscribe({
      next: (result) => {
        this.pageTitle.showSuccessToast(result.message)
        this.load_classes();
      },
      error: (error) => {
        this.pageTitle.showErrorToast(error.error.message)
      }
    })

  }
  // ---------------abrevigate
  abrevigateFiliere(name: string) : string{
    const wordAbreviate = name.split(' ');
    const word = wordAbreviate.filter(word =>word.length > 3).map(word => word[0].toUpperCase()).join('');
    return word;
  }

  onError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/business-professional-icon.svg';
  }
}

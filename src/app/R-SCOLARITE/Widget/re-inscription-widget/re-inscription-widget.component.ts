import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Student } from '../../../Admin/Models/Students';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EtudeService } from '../../../Admin/Views/etudiants/etude.service';
import { ClassRoom } from '../../../Admin/Models/Classe';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { SchoolService } from '../../../Services/school.service';
import { AnneeScolaire } from '../../../Admin/Models/School-info';
import { PageTitleService } from '../../../Services/page-title.service';

@Component({
  selector: 'app-re-inscription-widget',
  templateUrl: './re-inscription-widget.component.html',
  styleUrl: './re-inscription-widget.component.css'
})
export class ReInscriptionWidgetComponent implements OnInit {

  @Input() student!: Student
  @Output() closeModal = new EventEmitter<any>()
  classRoom: ClassRoom [] = []
  class_select!: ClassRoom
  all_annee: AnneeScolaire[]=[]
  anneeSelect !: AnneeScolaire
  constructor(private infoscool: SchoolService, private pageTitle: PageTitleService,
    private classeService: ClassStudentService, private studentService: EtudeService) { }
  ngOnInit(): void {
      this.loa_classe()
      this.getAnneeScolaire();
  }

  loa_classe(){
    this.classeService.getAll().subscribe(data =>{
      this.classRoom = data;
      console.log(this.classRoom, "class");
    });
  }
  // ----------------------------get all annee scolaire
  getAnneeScolaire(){
    this.infoscool.getAll_annee().subscribe(data =>{
      this.all_annee = data;
    })
  }
  // -------------------------on select class
  onSelect(event : any){
    const idClasse = event.target.value
    this.class_select = this.classRoom.find(cl=> cl.id == +idClasse)!;
  }

  // ----------------------------on select annee
  onSelectAnnee(event : any){
    const idAnnee = event.target.value
    this.anneeSelect = this.all_annee.find(ans=> ans.id == +idAnnee)!;

  }
  send(){
    this.student.idClasse = this.class_select
    this.student.idAnneeScolaire = this.anneeSelect
    this.student.idEtudiant = 0
    console.log(this.student, "student")
    // return
    this.studentService.reInscriptionStudent(this.student).subscribe({
      next: (result)=>{
        this.pageTitle.showSuccessToast(result.message)
        this.closeModal.emit()
      },
      error: (error)=>{
        this.pageTitle.showErrorToast(error.error.message)
      }
    })

    // this.studentService.reInscriptionStudent()
  }
  close(){
    this.closeModal.emit()
  }
}

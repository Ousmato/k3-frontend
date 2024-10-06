import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Student, Student_reinscription } from '../../../Admin/Models/Students';
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

  @Input() student?: Student
  @Input() nextClass?: ClassRoom[] = []
  @Output() closeModal = new EventEmitter<any>()
  classRoom: ClassRoom[] = []
  class_select!: ClassRoom
  constructor(private pageTitle: PageTitleService,
     private studentService: EtudeService) { }
  ngOnInit(): void {
    console.log("bien entre dans widget add niv sup")
    // this.getAnneeScolaire();
  }

  // --------------------on select class
  onSelect(event: any) {
    if (this.nextClass?.length === 0) {
      this.pageTitle.showErrorToast("Aucun classe supperieur trouver")
    }
    const idClasse = event.target.value
    this.class_select = this.nextClass!.find(cl => cl.id == +idClasse)!;
  }
  send() {
    const idStudent = this.student?.idEtudiant

    const idClasse = this.class_select.id!
    const { numero, modules, ...studut } = this.student!;

    console.log(idStudent, "idStudent", idClasse, "idClasse")
    // return
    this.studentService.reInscriptionStudent(studut!, idClasse!).subscribe({
      next: (result) => {
        this.pageTitle.showSuccessToast(result.message)
        this.closeModal.emit()
      },
      error: (error) => {
        this.pageTitle.showErrorToast(error.error.message)
      }
    })

  }
  close() {
    this.closeModal.emit()
  }
}

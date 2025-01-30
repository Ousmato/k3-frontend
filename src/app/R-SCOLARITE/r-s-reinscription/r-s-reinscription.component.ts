import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EtudeService } from '../../Admin/Views/Etudiants/etude.service';
import { IconsService } from '../../Services/icons.service';
import { PageTitleService } from '../../Services/page-title.service';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { Admin } from '../../Admin/Models/Admin';
import { AdminUSER } from '../../Admin/Models/Auth';

@Component({
  selector: 'app-r-s-reinscription',
  templateUrl: './r-s-reinscription.component.html',
  styleUrl: './r-s-reinscription.component.css'
})
export class RSReinscriptionComponent implements OnInit {

  @Input() list_checked: number[] = [];
  @Input() idClasse!: number
  admin!: Admin
  @Output() closeModale = new EventEmitter<any>();

  constructor(private service: EtudeService,
    private classeService: ClassStudentService, public icons: IconsService,
    private pageTitle: PageTitleService) { }

  ngOnInit(): void {
    this.admin = AdminUSER()?.scolarite
   
  }
 

  // close modal
  exitConfirm() {
    console.log("-------------------id select", this.idClasse)
   this.list_checked = []
   this.closeModale.emit();
  }

  confirmInscription(ids: number[]){
    this.service.reInscriptionStudent(ids, this.idClasse, this.admin.idAdministra!).subscribe({
      next: (result) => {
        this.pageTitle.showSuccessToast(result.message)
        this.list_checked = []
        this.closeModale.emit()

      },
      error: (error) => {
        this.pageTitle.showErrorToast(error.error.message)
      }
    })
  }
}

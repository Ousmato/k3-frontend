import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../DER/EDT/Services/service.service';
import { Semestres } from '../../Admin/Models/Semestre';
import { SemestreService } from '../../Services/semestre.service';
import { ClassRoom } from '../../Admin/Models/Classe';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { Emplois } from '../../DER/EDT/Models/Emplois';
import { DatePipe, Location } from '@angular/common';
import { PageTitleService } from '../../Services/page-title.service';
import { Module } from '../../Admin/Models/Module';
import { Admin } from '../../Admin/Models/Admin';
import { AdminUSER } from '../../Admin/Models/Auth';

@Component({
  selector: 'app-emplois-widget',
  templateUrl: './emplois-widget.component.html',
  styleUrl: './emplois-widget.component.css'
})
export class EmploisWidgetComponent  {

 @Input() idClasse!: number
 @Output() closeUpdateModal = new EventEmitter<any>();
  updateEmplois!: FormGroup
  semestre: Semestres[] = [];
  semestreSelect!: Semestres
  admin!: Admin
  @Input() emplois?: Emplois
  classerom !: ClassRoom
  formattedDateFin!: string
  modules : Module [] = []
  show_deleted : boolean = true
  isOverlay : boolean = true

  constructor(private fb: FormBuilder,private emploisService: ServiceService,
    private pageTitle: PageTitleService,
     private datePipe:DatePipe, 
     private semestreService: SemestreService, private classService: ClassStudentService) { }

  ngOnInit(): void {
    this.admin = AdminUSER()?.der
      this.load_update_form();
      this.loadModules();
  }


  // ------------------
  load_update_form(){
    this.updateEmplois = this.fb.group({
      idSemestre: [this.emplois?.idSemestre],
      idClasse: [this.emplois?.idClasse],
      idModule: ['', Validators.required],
      // seanceType: ['', Validators.required],
      dateDebut: [this.emplois?.dateDebut],
      dateFin: [this.emplois?.dateFin]
    });
  }
  // --------------------load all module
  loadModules(){
    this.classService.getAllModulesByClasseAndSemestre(this.emplois?.idClasse.id!, this.emplois?.idSemestre.id!).subscribe(result =>{
      this.modules = result;
    })
  }
  update(){
    const formData = this.updateEmplois.value;
    console.log(formData, "formdata")
    const module = this.modules.find(m =>m.id == formData.idModule);
    this.emplois = {
      id: this.emplois?.id,
      dateDebut: formData.dateDebut,
      idAdmin: this.admin,
      dateFin: formData.dateFin,
      idClasse: this.emplois?.idClasse!,
      idModule: module!,
      idSemestre: this.emplois?.idSemestre!,
    }

    console.log(this.emplois, "emploi to send");
    // return
    if(this.updateEmplois.valid){
      // return
      console.log( this.emplois , " to send")
      this.emploisService.updateEmplois(this.emplois).subscribe({
        next: (response) => {
          this.pageTitle.showSuccessToast(response.message);
         
          this.close_update();
        },
        error: (err) => {
          this.pageTitle.showErrorToast(err.error.message)
          console.error(err);
          this.isOverlay = false;
        }
      })
    }
    

  }

  // ----------------module select
  date_check(event: any){

    const dateDebut = event.target.value
    const dateDebu = new Date(dateDebut!)
    const dateFin = new Date(dateDebu);
    dateFin.setDate(dateDebu.getDate() + 5);
    this.formattedDateFin = this.datePipe.transform(dateFin, 'yyyy-MM-dd')!;
    this.updateEmplois.get('dateFin')?.setValue(this.formattedDateFin);
    console.log(this.formattedDateFin, "date fin")
   
  }
  close_update(){
    this.isOverlay = false;
    this.closeUpdateModal.emit();
  }
 
}

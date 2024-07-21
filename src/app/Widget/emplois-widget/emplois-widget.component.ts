import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../Admin/Views/emplois-du-temps/service.service';
import { Semestres } from '../../Admin/Models/Semestre';
import { SemestreService } from '../../Services/semestre.service';
import { ClassRoom } from '../../Admin/Models/Classe';
import { ClassStudentService } from '../../Admin/Views/class-students/class-student.service';
import { Emplois } from '../../Admin/Models/Emplois';
import { DatePipe, Location } from '@angular/common';
import { PageTitleService } from '../../Services/page-title.service';

@Component({
  selector: 'app-emplois-widget',
  templateUrl: './emplois-widget.component.html',
  styleUrl: './emplois-widget.component.css'
})
export class EmploisWidgetComponent implements OnInit, OnChanges {

 @Input() idClasse!: number
 @Output() closeUpdateModal = new EventEmitter<ClassRoom>();
  updateEmplois!: FormGroup
  semestre: Semestres[] = [];
  semestreSelect!: Semestres
  emplois_find?: Emplois
  classerom !: ClassRoom
  formattedDateFin!: string
  classes : ClassRoom [] = []
  isShow_update : boolean = true
  isOverlay : boolean = true

  constructor(private fb: FormBuilder,private emploisService: ServiceService, private pageTitle: PageTitleService,
     private datePipe:DatePipe, 
     private semestreService: SemestreService, private classService: ClassStudentService) { }

  ngOnInit(): void {
    
    
    this.load_semestre();
    this.load_classe();
    this.loa_emploi();
      this.load_update_form();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idClasse'] && changes['idClasse'].currentValue) {
      this.load_classe();
    }
  }
// --------------------------load form update
  load_update_form(): void {
    this.updateEmplois = this.fb.group({
      id: [''],
      idSemestre: ['', Validators.required],
      idClasse: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [{ disabled: true }],
    });
  }
  // ------------------load all semestre
  load_semestre(){
    this.semestreService.getAllSemestre().subscribe(data => {
      this.semestre = data;
    })
  }
  // -------------------------------load all classe
  load_classe(){
    // this.load_semestre();
    this.classService.getAll().subscribe(data => {
      this.classes = data;
    })
  }
  // --------------------------update semestre
  submit_update_form(){
   const formData = this.updateEmplois.value
   const idClasse = this.classes.find(cl =>cl.id == +formData.idClasse);
   const idSemestre = this.semestre.find(sm=> sm.id == +formData.idSemestre);
   const emplois : Emplois = {
      id: +formData.id,
      dateDebut: formData.dateDebut,
      dateFin: formData.dateFin,
      idClasse: idClasse!,
      idSemestre: idSemestre!
   }
   if(this.updateEmplois.valid){
    this.emploisService.updateEmplois(emplois).subscribe({
     next: (responae) => {
       this.isShow_update = false;
       this.closeUpdateModal.emit(idClasse);
       this.isOverlay = false;
       this.pageTitle.showSuccessToast(responae.message);
       // this.load_emploi();
     },
     error: (erreur) => {
      this.pageTitle.showErrorToast(erreur.error.message)
      //  console.error('Erreur lors de la modification de l\'emploi :', error);
     }
   })
   console.log(emplois, "formdata");
   }else{
    this.updateEmplois.markAllAsTouched();
    console.log('non valide', this.updateEmplois.value);
   }
   

  }
  // --------------------dimis modal update
  close_update_modal(){
    // this.location.back();
    this.isShow_update = false;
    this.closeUpdateModal.emit();
    this.isOverlay = false;
    
  }

  // ------------------------------------event to selesct semestre
    onDateChange(event: any){
      const dateDebut = new Date(event.target.value);
      const dateFin = new Date(dateDebut);
      dateFin.setDate(dateDebut.getDate() + 7);
      this.formattedDateFin = this.datePipe.transform(dateFin, 'yyyy-MM-dd')!;

      this.updateEmplois.get('dateFin')?.setValue(this.formattedDateFin);
      // console.log(this.formattedDateFin, "date fin")

    }
  // load emplois
  loa_emploi(){
    // this.load_semestre();
    this.emploisService.hasActiveEmploisByClasse(this.idClasse).subscribe({
      next: (hasEmplois) => {
        if(hasEmplois == true){
          console.log(hasEmplois, "pas de seance")
          // this.isShow_update_emplois = true
          this.emploisService.getEmploisByClasse2(this.idClasse).subscribe(emplois =>{
           this.emplois_find = emplois;

            this.updateEmplois.patchValue({
              id: emplois.id,
              // idSemestre: emplois.idSemestre,
              // idClasse: emplois.idClasse,
              dateDebut: emplois.dateDebut,
              dateFin: emplois.dateFin
            })
            // this.updateEmplois.get('')
            // this.isShow_update_emplois = true;
            console.log(this.emplois_find, "emploi trouver")

          })
         
        } else if(hasEmplois == false) {
          console.log(hasEmplois, "seance pas d'emplois actif")
          // this.toastr.error("Auccun emplois disponible", "Erreur")
        }else{
          // this.toastr.error("L'emploi du temps ne peut pas etre modifier, des seances son deja associer", "Erreur")
           console.log(hasEmplois, "objet")
        }
       
      }
    })
  }
}

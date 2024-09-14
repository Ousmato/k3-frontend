import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IconsService } from '../../Services/icons.service';
import { PageTitleService } from '../../Services/page-title.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SemestreName, Semestres } from '../../Admin/Models/Semestre';
import { SetService } from '../../Admin/Views/settings/set.service';
import { SchoolService } from '../../Services/school.service';
import { AnneeScolaire } from '../../Admin/Models/School-info';

@Component({
  selector: 'app-semestre-widget',
  templateUrl: './semestre-widget.component.html',
  styleUrl: './semestre-widget.component.css'
})
export class SemestreWidgetComponent implements OnInit {

  @Output() closeModal = new EventEmitter<any>();
  add_semestre!: FormGroup 
  update_semestre_form!: FormGroup 

  semestres: Semestres[] = []
  show_update: boolean = false;
  show_add: boolean = false;
  show_deleted: boolean = false;
  isConfirm: boolean = false;
  semestreFordelete!: Semestres
  annees: AnneeScolaire[] =[]
  semestreNames : {key: string, value: string}[] = []

  constructor( public icons: IconsService, private infoSchool: SchoolService,
    private pageTitle: PageTitleService, private fb: FormBuilder, private setService: SetService){}
  ngOnInit(): void {
    this.load_formAdd();
    // this.get_semestres();
    this.get_annees();
    this.load_semestre_form();
    this.getSemestreName()
    
  }
  // -------------------------------add semestre
  load_formAdd(){
    this.add_semestre = this.fb.group({
      nomSemetre: ['', [Validators.required, Validators.maxLength(40)]],
      dateDebut: ['',Validators.required],
      datFin: ['',Validators.required],
      idAnneeScolaire: ['',Validators.required]

    })
  }

  // ----------------------------method add
  submit(){
    const formData = this.add_semestre.value;
    const annee = this.annees.find(an => an.id == formData.idAnneeScolaire)!
    const { ans, ...anneeWithout } = annee;
    const semestre : Semestres = {
      nomSemetre: formData.nomSemetre,
      dateDebut: formData.dateDebut,
      datFin: formData.datFin,
      idAnneeScolaire: anneeWithout!
    }
    // console.log(semestre, "semestre")
    // return
    if(this.add_semestre.valid){
      this.setService.createSemestre(semestre).subscribe({
        next: (response) =>{
          this.pageTitle.showSuccessToast(response.message);
          this.add_semestre.reset();
          this.load_formAdd()
          this.get_semestres();
          this.show_add = false
          this.closeModal.emit();
        },
        error: (erreur) =>{
          this.pageTitle.showErrorToast(erreur.error.message)
        }
      })
    }else{
      this.add_semestre.markAllAsTouched();
      console.log("invalid", this.add_semestre.value);
    }
    
  }

   // -------------------------------get all semestre
   get_semestres(){
    this.setService.getSemestres().subscribe(semestres => {
      semestres.forEach(sm =>{
        
        const date = new Date(sm.idAnneeScolaire.finAnnee)
        sm.idAnneeScolaire.ans = date.getFullYear();
      }); 
      this.semestres = semestres;
      console.log(semestres, "semestres")
    })
  }
   // ---------------------------------------update semestre
   load_semestre_form(){
    this.update_semestre_form = this.fb.group({
      id: [''],
      nomSemetre: ['', Validators.required],
      dateDebut: ['', Validators.required],
      datFin: ['', Validators.required],
      idAnneeScolaire: ['', Validators.required]
    });
  }
 
  update(){
    const formData = this.update_semestre_form.value;
    const annee = this.annees.find(an => an.id == formData.idAnneeScolaire)!;
    const {ans, ...anneWithou} = annee;
    const semestre : Semestres ={
      id: +formData.id,
      nomSemetre: formData.nomSemetre,
      dateDebut: formData.dateDebut,
      datFin: formData.datFin,
      idAnneeScolaire: anneWithou!
    }
    // console.log(semestre, "semestre update")
    // return
    this.setService.updateSemestre(semestre).subscribe({
      next: (response) =>{
        this.pageTitle.showSuccessToast(response.message)
        this.update_semestre_form.reset();
        this.load_semestre_form()
        this.get_semestres();
        this.show_update = false
        this.closeModal.emit();
      },
      error: (erreur) => {
        this.pageTitle.showErrorToast(erreur.error.message)
      }
    } )

  }

  // ---------------------get all annee scolaire
  get_annees(){
    this.infoSchool.getAll_annee().subscribe(data =>{
      this.annees = data;
      this.annees.forEach(ans=>{
        const annee = new Date(ans.debutAnnee)
        const debutAnnee = annee.getFullYear()
        ans.ans = debutAnnee
      })
    })
  }
  // ----------------------------------------------------------------
  onSemestreChange(event: any){
   const selectedSemestreId = event.target.value;
    const selectSemestre = this.semestres.find(sem => sem.id == selectedSemestreId);
    // console.log(selectSemestre, "semestre trover")
    this.update_semestre_form.get('id')?.setValue(selectSemestre?.id);
    this.update_semestre_form.get('nomSemetre')?.setValue(selectSemestre?.nomSemetre);
    this.update_semestre_form.get('dateDebut')?.setValue(selectSemestre?.dateDebut);
    this.update_semestre_form.get('datFin')?.setValue(selectSemestre?.datFin);
    this.update_semestre_form.get('idAnneeScolaire')?.setValue(selectSemestre?.idAnneeScolaire.id);
  }

  onDelete(event: any){
    const idSelect = event.target.value
    this.semestreFordelete = this.semestres.find(sem => sem.id === +idSelect)!;
    console.log(this.semestreFordelete, " is select");

  }

  delete_semestre(idSemestre : number){

    // this.setService

  }
  close_add(){
    this.show_add = false
    this.closeModal.emit();
  }
  close_update(){
    this.show_update = false
    this.closeModal.emit();
  }

  show_updated(){
    this.get_semestres();
    this.show_update = true;
    this.closeModal.emit();
  }
  show_delete(){
    this.get_semestres();
    this.show_deleted = true
    this.closeModal.emit()
  }

  show_added(){
    this.show_add = true;
    this.closeModal.emit();
  }

  annuler(){
    this.show_deleted = false
    this.closeModal.emit();
  }

  exitDelete(){
    this.isConfirm = false;
    this.closeModal.emit();
  }
  nextToConfirm(){
    this.show_deleted = false
    this.isConfirm = true;
    // this.closeModal.emit();
  }

  // ------------------------get semestre name
  getSemestreName() {
    const objet = Object.keys(SemestreName).map(key =>({
      key : key,
      value: SemestreName[key as keyof typeof SemestreName]
    }))
    objet.forEach(o =>{
      this.semestreNames.push(o)
    })
  }
}

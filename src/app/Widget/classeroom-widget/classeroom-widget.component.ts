import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassRoom, DTONivauFiliereClass } from '../../Admin/Models/Classe';
import { IconsService } from '../../Services/icons.service';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { PageTitleService } from '../../Services/page-title.service';
import { NivFiliere } from '../../Admin/Models/NivFiliere';
import { SetService } from '../../Admin/Views/settings/set.service';
import { AnneeScolaire } from '../../Admin/Models/School-info';
import { SchoolService } from '../../Services/school.service';
import { Filiere } from '../../Admin/Models/Filieres';
import { Niveau } from '../../Admin/Models/Niveau';
import { FiliereService } from '../../Services/filiere.service';

@Component({
  selector: 'app-classeroom-widget',
  templateUrl: './classeroom-widget.component.html',
  styleUrl: './classeroom-widget.component.css'
})
export class ClasseroomWidgetComponent implements OnInit {

  show_update: boolean = false
  show_add: boolean = false
  show_deleted: boolean = false
  isConfirm: boolean = false

  @Output() closeModal = new EventEmitter<any>();
  classes: ClassRoom[] = []
  annees: AnneeScolaire[] = []
  filieres: Filiere[] = []
  nivFilieres: NivFiliere[] = []
  niveaux: Niveau[] = []
  update_classe_form!: FormGroup
  addClass!: FormGroup

  classFordelete!: ClassRoom

  constructor(private classService: ClassStudentService, public icons: IconsService, 
    private infoSchool: SchoolService, private filiereService:FiliereService,
    private pageTitle: PageTitleService, private fb: FormBuilder, private setService: SetService) { }
  ngOnInit(): void {
    this.load_all_classe()
    this.load_form_update();
    this.load_fillere();
    this.load_form_add()
    this.get_annees();
    
  }

  onClasseChange(event: any){
    const idSelect = event.target.value
    const selectClasse = this.nivFilieres.find(c =>c.id == idSelect)
    this.update_classe_form.get("scolarite")?.setValue(selectClasse?.scolarite);
    this.update_classe_form.get("id")?.setValue(selectClasse?.id);


  }

  // ---------------------on delete
  onDelete(event: any){
    const selectedId = event.target.value;
    this.classFordelete = this.classes.find(cl => cl.id == selectedId)!;

  }

  delete_classe(idSelect: number){}
  // ----------------------------------load classes
  load_all_classe(){
    this.classService.getAllCurrentClassOfYear().subscribe((res: ClassRoom[]) =>{
      this.classes = res;
    })
  }
  get_nivFiliere(){
    this.classService.getAllNivFil().subscribe(data =>{
      this.nivFilieres = data;
    })

  }
  // ---------------------------------load form
  load_form_update(){
    this.update_classe_form = this.fb.group({
      id: [''],
      idFiliere: [''],
      scolarite: ['', [Validators.required, Validators.min(100000), Validators.max(3000000)]]
    });
  }
  load_fillere(){
    this.setService.getAllNiveau().subscribe(result =>{
        this.niveaux = result;
      })
    this.filiereService.getAll_filiere().subscribe(result =>{
        this.filieres = result;
      })

  }

   // -------------------------get annees
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
// ---------------------------------form to create class-room
load_form_add(){
  this.addClass = this.fb.group({
    idNiveau: ['',Validators.required],
    idFiliere: ['',Validators.required],
    scolarite: ['',[Validators.required, Validators.min(100000), Validators.max(3000000)]]
  });
  
}
// -----------------------------methode add class-room
  createClassroom(){
    const formData = this.addClass.value;
    const niveau = this.niveaux.find(nv => nv.id == formData.idNiveau);
    const filiere = this.filieres.find(fl => fl.id == formData.idFiliere);
    const nivFil : NivFiliere ={
      idNiveau: niveau!,
      idFiliere: filiere!,
      scolarite: formData.scolarite
    }
    
    if(this.addClass.valid){
        this.setService.addNiveauFiliere(nivFil).subscribe({
          next: (response) =>{
            this.pageTitle.showSuccessToast(response.message);
            this.addClass.reset();
            this.load_fillere();
            this.load_form_add()
            this.show_add = false;
            this.closeModal.emit();
          }, 
          error: (erreur)=>{
            this.pageTitle.showErrorToast(erreur.error.message);
          }
      
      })
    }else{
    this.addClass.markAllAsTouched();
    console.log(this.addClass.value);
    }
    

  }

  // --------------------update
  update_classe(){
    const formData = this.update_classe_form.value;
    
    if(this.update_classe_form.valid){
        this.setService.updateNiveauFiliere(formData).subscribe({
          next: (response) =>{
            this.pageTitle.showSuccessToast(response.message);
            this.update_classe_form.reset();
            this.get_nivFiliere();
            this.show_update = false;
            this.closeModal.emit();
          }, 
          error: (erreur)=>{
            this.pageTitle.showErrorToast(erreur.error.message);
          }
      
      })
    }else{
    this.update_classe_form.markAllAsTouched();
    
  }
}

  close_update(){
    this.show_update = false
    this.closeModal.emit();
  }
  close_add(){
    this.show_add = false
    this.closeModal.emit();
  }

  show_added(){
    this.show_add =! this.show_add
    this.closeModal.emit();
  }
  show_updated(){
    this.get_nivFiliere();
    this.show_update = true
    this.closeModal.emit();
  }
  show_delete(){
    this.show_deleted = true
    this.closeModal.emit();
  }
  exitDelete(){
    this.isConfirm = false
  }
  close_delete(){
    this.show_deleted = false
    this.closeModal.emit();
  }
  nextToConfirm(){
    this.isConfirm = true;
    this.show_deleted = false
    this.closeModal.emit();
  }
}

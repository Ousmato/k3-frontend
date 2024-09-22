import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddUeDto, Ue } from '../../Admin/Models/UE';
import { SetService } from '../../Admin/Views/settings/set.service';
import { PageTitleService } from '../../Services/page-title.service';
import { IconsService } from '../../Services/icons.service';
import { NivFiliere } from '../../Admin/Models/NivFiliere';
import { ClassRoom } from '../../Admin/Models/Classe';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { SemestreService } from '../../Services/semestre.service';
import { Semestres } from '../../Admin/Models/Semestre';

@Component({
  selector: 'app-ue-widget',
  templateUrl: './ue-widget.component.html',
  styleUrl: './ue-widget.component.css'
})
export class UeWidgetComponent implements OnInit {

  @Output() closeModale = new EventEmitter<any>();
  addUe!: FormGroup 
  update_ue_form!: FormGroup 

  ueList: Ue[] = []
  semestre: Semestres[] = []
  show_update: boolean = false;
  show_add: boolean = false;
  show_deleted: boolean = false;
  isOldUe: boolean = false;
  isConfirm: boolean = false;
  ueForDeleted!: Ue
  oldUes: Ue [] = [];
  classes: ClassRoom[] = []

  constructor(private setService: SetService, private semestreService: SemestreService,
    public icons: IconsService, private classService: ClassStudentService,
    private pageTitle: PageTitleService, private fb: FormBuilder){}

  ngOnInit(): void {
    // this.load_formAdd();
    this.load_formUpdate();
  }

  // -------------------load form
  
  load_formUpdate(){
    this.update_ue_form = this.fb.group({
      id: [''],
      nomUE: ['', [Validators.required, Validators.maxLength(40)]],
      
    });
  }
 
 
// ----------------------------get all niveau filiere
load(){
  this.semestreService.getCurrentSemestresOfYear().subscribe(result =>{
    this.semestre = result;
    console.log(this.semestre, "semestre");
  })
  this.classService.getAllCurrentClassOfYear().subscribe(response =>{
    this.classes = response;
    console.log(this.classes, "---------nivF")
  
  })
}
  load_ues(){
    this.setService.getAll_ue_all().subscribe(response =>{
      this.ueList = response;
    
    })
  
  }
 
  // -------------------------------------------create ue ----------------------------------------
  update_ue(){
    const formData = this.update_ue_form.value;
    // console.log(formData, "fffff", id)
    const ue : Ue ={
      id: formData.id,
      nomUE: formData.nomUE
    }
    if(this.update_ue_form.valid){
        this.setService.updateUe(ue).subscribe({
          next: (response) =>{
            this.pageTitle.showSuccessToast(response.message + "Succè");
            this.load_ues();
            this.update_ue_form.reset();
          },
          error: (erreur) =>{
            this.pageTitle.showErrorToast(erreur.error.message)
          }
      })
    }else{
      this.update_ue_form.markAllAsTouched();
      console.log(this.update_ue_form.value, "invalid");
    }
   
  }

  onUeChange(event: any) {
    const selectedUeId = event.target.value;
    const ueFind = this.ueList.find(u =>u.id == selectedUeId)
    console.log(ueFind, "ue trouver")
    this.update_ue_form.get('nomUE')?.setValue(ueFind?.nomUE);
    this.update_ue_form.get('id')?.setValue(ueFind?.id);
    
  }

  onDelete(event: any){
    const idSelect = event.target.value;
    
    this.ueForDeleted = this.ueList.find(u => u.id == idSelect)!;
    this.isConfirm = true;
    this.closeModale.emit();
  }

  delete_niveau(idUe: number){
    this.setService.deleteUe(idUe).subscribe({
      next: (response) => {
        this.pageTitle.showSuccessToast(response.message);
        this.load_ues();
        this.show_deleted = false

      },
      error: (erreur) => {
        this.pageTitle.showErrorToast(erreur.error.message);
      }

    })
  }
  // --------------------------
  exitDelete(){
    this.isConfirm = false;
    this.closeModale.emit();
  }
  close_update(){
    this.show_update = false;
    this.closeModale.emit();
  }
  

  show_added(){
    this.load();
    this.show_add = true
    this.closeModale.emit();
  }
  show_delete(){
    this.show_deleted = true
    this.closeModale.emit();
  }
  show_updated(){
    this.show_update = true;
    this.closeModale.emit();
  }
  close_delete(){
    this.show_deleted = false;
    this.closeModale.emit();
  }
  nextToConfirm(){
    this.isConfirm = true
    this.closeModale.emit();
  }
  // --------------------------
  
  close_old_ues(){
    this.isOldUe = false;
    this.closeModale.emit();
  }
}

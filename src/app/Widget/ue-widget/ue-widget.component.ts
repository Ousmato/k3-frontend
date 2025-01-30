import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddUeDto, Ue } from '../../Admin/Models/UE';
import { SetService } from '../../Admin/Views/settings/set.service';
import { PageTitleService } from '../../Services/page-title.service';
import { IconsService } from '../../Services/icons.service';
import { NivFiliere } from '../../Admin/Models/NivFiliere';
import { ClassRoom } from '../../Admin/Models/Classe';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { SemestreService } from '../../Services/semestre.service';
import { Semestres } from '../../Admin/Models/Semestre';
import { Admin } from '../../Admin/Models/Admin';
import { AdminUSER } from '../../Admin/Models/Auth';
import { Ecue, Module } from '../../Admin/Models/Module';

@Component({
  selector: 'app-ue-widget',
  templateUrl: './ue-widget.component.html',
  styleUrl: './ue-widget.component.css'
})
export class UeWidgetComponent implements OnInit {

  @Output() closeModale = new EventEmitter<any>();
  addUe!: FormGroup 
  update_ue_form!: FormGroup 
  // module!: FormGroup

  ueList: Ue[] = []
  @Input() module!: Ecue
  @Input() ue!: AddUeDto
  // semestre: Semestres[] = []
  @Input() show_update: boolean = false;
  // show_add: boolean = false;
 @Input() show_deleted: boolean = false;
  isConfirm: boolean = false;
  ueForDeleted!: Ue
  admin!: Admin 
  oldUes: Ue [] = [];
  classes: ClassRoom[] = []

  constructor(private setService: SetService,
    public icons: IconsService,
    private pageTitle: PageTitleService, private fb: FormBuilder){}

  ngOnInit(): void {
    console.log(this.show_deleted, "show_deleted")
    if(this.ue != null){
      this.load_formUpdate();
    }
    
    this.admin = AdminUSER()?.scolarite
  }

  // load form
  
  load_formUpdate(){
    this.update_ue_form = this.fb.group({
      id: [this.ue.idUe.id],
      nomUE: [this.ue.idUe.nomUE, [Validators.required, Validators.maxLength(120)]],
      modules: this.fb.array([])
    });

    if (this.ue.modules && this.ue.modules.length > 0) {
      const moduleControls = this.ue.modules.map(module => this.createModules(module));
      const modulesFormArray = this.update_ue_form.get('modules') as FormArray;
      console.log(modulesFormArray, "modulescontrols");

      moduleControls.forEach(control =>modulesFormArray.push(control));
    }
  }

 createModules(module: any): FormGroup {
    return this.fb.group({
      id: [module.id],
      coefficient: [module.coefficient, [Validators.required, Validators.min(1), Validators.max(10)]],
      nomModule: [module.nomModule, [Validators.required, Validators.maxLength(40)]],
      description: [module.description, [Validators.required]]
    });
  }
 
  get modules(): FormGroup[] {
    return (this.update_ue_form.get('modules') as FormArray).controls as FormGroup[];
  }

  // -------------------------------------------create ue ----------------------------------------
  update_ue(){
    const formData = this.update_ue_form.value;
    const modList = formData.modules
    // const formDataModules
    console.log(formData, "fffff", )
    // return
    const ue : Ue ={
      id: formData.id,
      nomUE: formData.nomUE,
      idAdmin: this.admin
      
    }
  
  const upd : AddUeDto ={
    idClasse: this.ue.idClasse,
    semestre: this.ue.semestre,
    idUe: ue,
    modules: modList
  }
    
    
    if(this.update_ue_form.valid){
      console.log(upd, "ue to update")
      // return
        this.setService.updateUe(upd).subscribe({
          next: (response) =>{
            this.pageTitle.showSuccessToast(response.message + "Succè");
            
            this.update_ue_form.reset();
            this.closeModale.emit()
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

  deleteUe(idModule: number){
    this.setService.deleteModule(idModule).subscribe({
      next: (response) => {
        this.pageTitle.showSuccessToast(response.message);
        this.show_deleted = false
        this.closeModale.emit()

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
    // this.load();
    // this.show_add = true
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
  
}

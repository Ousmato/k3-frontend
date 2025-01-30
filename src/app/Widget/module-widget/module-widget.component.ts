import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTitleService } from '../../Services/page-title.service';
import { IconsService } from '../../Services/icons.service';
import { SetService } from '../../Admin/Views/settings/set.service';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { Ue } from '../../Admin/Models/UE';
import {  Module } from '../../Admin/Models/Module';
import { ClassRoom } from '../../Admin/Models/Classe';

@Component({
  selector: 'app-module-widget',
  templateUrl: './module-widget.component.html',
  styleUrl: './module-widget.component.css'
})
export class ModuleWidgetComponent implements OnInit {


  @Output() closeModale = new EventEmitter<any>();
  @Input () Ue !: Ue

  addForm!: FormGroup;
  // ueListe : Ue[] = []
  // modules : Module[] = []
  // classes : ClassRoom[] = []
  moduleForDelete!: Module

  constructor(private fb: FormBuilder,  private pageTitle: PageTitleService,
    private service: SetService, public icons: IconsService, private classService: ClassStudentService){}


  ngOnInit(): void {
    console.log(this.Ue, "ue checked")
    this.loadForm();
  }


  // ------------------load form add module
 

  loadForm() {
    this.addForm = this.fb.group({
      nomModule : ['',[Validators.required, Validators.maxLength(40)]],
      coefficient : ['', [Validators.required, Validators.min(1), Validators.max(6)]],
      idUe : [this.Ue.id, Validators.required]

    })
   
  }

  //  method update
  update(){
    const formData = this.addForm.value
    // const idUe = this.ueListe.find(ue => ue.id == formData.idUe)
    const module : Module = {
     nomModule: formData.nomModule,
     coefficient: formData.coefficient,
     idUe: this.Ue!
    }
    // console.log(module, "mmmmmm")
   //  return
   if(this.addForm.valid){
      this.service.addModule(module!).subscribe({
        next: (data) => {
          this.pageTitle.showSuccessToast(data.message);
          this.addForm.reset();
          this.closeModale.emit();
        },
        error: (erreur) => {
          this.pageTitle.showErrorToast(erreur.error.message);
        }
      })
    }else{
      this.addForm.markAllAsTouched();
    }                                                        
     
   }
  // ----------exit
 
  close_update(){
    this.closeModale.emit();
  }
 
  // ------------------------------
 
}

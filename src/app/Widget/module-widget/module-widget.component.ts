import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  ishow_add: boolean = false
  ishow_update: boolean = false
  ishow_delete: boolean = false
  isInputShow: boolean = false
  isConfirm: boolean = false
  isEcue: boolean = false
  addModule!: FormGroup;
  update_module_form!: FormGroup;
  ueListe : Ue[] = []
  modules : Module[] = []
  classes : ClassRoom[] = []
  moduleForDelete!: Module

  constructor(private fb: FormBuilder,  private pageTitle: PageTitleService,
    private service: SetService, public icons: IconsService, private classService: ClassStudentService){}


  ngOnInit(): void {
    this.load_ues();
    this.loadUpdateModuleForm();
  }

  // load all ue
  load_ues() {
    this.service.getAll_ue_all().subscribe(response =>{
      this.ueListe = response;
    
    })
  }

  // ------------------load form add module
 

  loadUpdateModuleForm() {
    this.update_module_form = this.fb.group({
      id: ['', Validators.required],
      nomModule : ['',[Validators.required, Validators.maxLength(40)]],
      coefficient : ['', [Validators.required, Validators.min(1), Validators.max(6)]],
      idUe : ['', Validators.required]

    })
   
  }

  // module change
  onModuleChange(event: any){
    this.isInputShow = true
    const idSelect = event.target.value;
    const module = this.modules.find(m =>m.id == idSelect)
    this.update_module_form.get('id')?.setValue(module?.id);
    this.update_module_form.get('nomModule')?.setValue(module?.nomModule);
    this.update_module_form.get('coefficient')?.setValue(module?.coefficient);
    // this.update_module_form.get('idUe')?.setValue(this.moduleFind?.idUe.nomUE);
  }

  onDelete(event: any){
    const idSelect = event.target.value;
    this.moduleForDelete = this.modules.find(m => m.id == idSelect)!
    this.isConfirm = true
    this.closeModale.emit();
  }

  // --------------------------delete methode
  delete_module(idUe: number){
    this.service.deleteModule(idUe).subscribe({
      next: (response) => {
        this.pageTitle.showSuccessToast(response.message);
        this.isConfirm = false
        this.load_module();
      },
      error: (erreur) => {
        this.pageTitle.showErrorToast(erreur.error.message);
      }
    })
  }
   // load modules liste
   load_module(){
    this.classService.allModuleWithoutNotes().subscribe((mods: Module[]) => {
      this.modules = mods; 
      // console.log("les modules")
    
    })
   }
  //  method update
  update(){
    const formData = this.update_module_form.value
    const idUe = this.ueListe.find(ue => ue.id == formData.idUe)
    const module : Module = {
     id: formData.id,
     nomModule: formData.nomModule,
     coefficient: formData.coefficient,
     idUe: idUe!
    }
    // console.log(module, "mmmmmm")
   //  return
   if(this.update_module_form.valid){
      this.service.updateModule(module!).subscribe({
        next: (data) => {
          this.pageTitle.showSuccessToast(data.message);
          this.update_module_form.reset();
          this.load_module();
          this.isInputShow = false
          // this.ishow_module = false;
        },
        error: (erreur) => {
          this.pageTitle.showErrorToast(erreur.error.message);
        }
      })
    }else{
      this.update_module_form.markAllAsTouched();
    }                                                        
     
   }
  // ----------exit
 
  close_update(){
    this.closeModale.emit();
    this.ishow_update = false
    this.isInputShow = false
  }
  close_delete(){
    
    this.ishow_delete = false
    this.closeModale.emit();
  }

  exitDelete(){
    this.isConfirm = false;
    this.closeModale.emit()
  }
  // ---------------------show form
 
  show_updated(){
    this.load_module();
    this.ishow_update = true;
    this.closeModale.emit();
  }
  show_delete(){
    this.load_module();
    this.ishow_delete = true
    this.closeModale.emit();
  }

  nextToConfirm(){
    this.isConfirm = true
    this.closeModale.emit();
  }

  // ------------------------------
 
}

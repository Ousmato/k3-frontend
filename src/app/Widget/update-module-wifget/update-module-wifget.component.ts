import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Module } from '../../Admin/Models/Module';
import { SetService } from '../../Admin/Views/settings/set.service';
import { IconsService } from '../../Services/icons.service';
import { PageTitleService } from '../../Services/page-title.service';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';

@Component({
  selector: 'app-update-module-wifget',
  templateUrl: './update-module-wifget.component.html',
  styleUrl: './update-module-wifget.component.css'
})
export class UpdateModuleWifgetComponent implements OnInit{

  update_module_form!: FormGroup
  moduleFind!: Module
  modules: Module[] = []
  ishow_module: boolean = true

  @Output()  closeWidget = new EventEmitter<any>();

  constructor(private fb: FormBuilder,  private pageTitle: PageTitleService,
    private service: SetService, public icons: IconsService, private classService: ClassStudentService){}


  
  ngOnInit(): void {
      this.loadUpdateModuleForm();
      this.load_module();
  }

  // load update module form
  loadUpdateModuleForm() {
    this.update_module_form = this.fb.group({
      id: ['', Validators.required],
      nomModule : ['',[Validators.required, Validators.maxLength(30)]],
      coefficient : ['', [Validators.required, Validators.min(1), Validators.max(6)]],
      idUe : ['', Validators.required]

    })
   
  }

  // module change
  onModuleChange(event: any){
    const moduleId_event = event.target.value;
    this.moduleFind = this.modules.find(m =>m.id == moduleId_event)!;
    this.update_module_form.get('id')?.setValue(this.moduleFind.id);
    this.update_module_form.get('nomModule')?.setValue(this.moduleFind.nomModule);
    this.update_module_form.get('coefficient')?.setValue(this.moduleFind!.coefficient);
    this.update_module_form.get('idUe')?.setValue(this.moduleFind?.idUe.nomUE);
    // this. ishow_module = true

    // this.load_module_input_value(this.modules, this.selectedModuleId);
  }

   // load modules liste
   load_module(){
    this.classService.allModuleWithoutNotes().subscribe((mods: Module[]) => {
      this.modules = mods; 
      console.log("les modules")
    
    })
   }
  //  method update
  update_module(moduleFind: Module){
    const formData = this.update_module_form.value
    const module : Module = {
     id: formData.id,
     nomModule: formData.nomModule,
     coefficient: formData.coefficient,
     idUe: moduleFind?.idUe!
    }
    console.log(module, "mmmmmm")
   //  return
   if(this.update_module_form.valid){
      this.service.updateModule(module!).subscribe({
        next: (data) => {
          this.pageTitle.showSuccessToast(data.message);
          this.update_module_form.reset();
          this.load_module();
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

  //  method close widgwt
  close_widget(){
    this.closeWidget.emit();
    this.ishow_module = false

  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTitleService } from '../../Services/page-title.service';
import { IconsService } from '../../Services/icons.service';
import { SetService } from '../../Admin/Views/settings/set.service';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { Ue } from '../../Admin/Models/UE';
import { Module } from '../../Admin/Models/Module';

@Component({
  selector: 'app-add-module-widget',
  templateUrl: './add-module-widget.component.html',
  styleUrl: './add-module-widget.component.css'
})
export class AddModuleWidgetComponent implements OnInit {

  // @Input() : 
  @Output()  closeModal = new EventEmitter<any>()
  ueListe : Ue[] = []
  isshow_add_module: boolean = true

  addModule!: FormGroup;

  constructor(private fb: FormBuilder,  private pageTitle: PageTitleService,
    private service: SetService, public icons: IconsService, private classService: ClassStudentService){}


  ngOnInit(): void {
    this.loa_form();
    this.load_ues();
  }

  // load all ue
  load_ues() {
    this.service.getAll_ue_all().subscribe(response =>{
      this.ueListe = response;
    
    })
  }

  // ------------------load form add module
  loa_form(){
    this.addModule = this.fb.group({
      nomModule : ['',[Validators.required, Validators.maxLength(30)]],
      coefficient : ['', [Validators.required, Validators.min(1), Validators.max(6)]],
      idUe : ['', Validators.required]

    })
  }
  // -----------------methode add
  creatModule(){
    const formData = this.addModule.value;
    const ue: Ue = this.ueListe.find(ue => ue.id === +formData.idUe)!;
    const module: Module = {
      nomModule: formData.nomModule,
      coefficient: formData.coefficient,
      idUe: ue
    }
    if(this.addModule.valid){
      this.service.createModule(module).subscribe({
      next: (response) => {
        this.pageTitle.showSuccessToast(response.message)
        this.addModule.reset();
        this.loa_form();
        this.load_ues();
      },
      error: (erreur) => {
        this.pageTitle.showErrorToast(erreur.error.message)
      }
    })
    }else{
      this.addModule.markAllAsTouched();
      console.log('invalid', this.addModule.value)
    }
    
  }
  // ----------exit
  annuler(){
    this.closeModal.emit();
    this.isshow_add_module = false
  }
}

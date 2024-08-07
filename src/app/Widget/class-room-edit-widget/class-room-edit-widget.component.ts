import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { IconsService } from '../../Services/icons.service';
import { PageTitleService } from '../../Services/page-title.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassRoom } from '../../Admin/Models/Classe';

@Component({
  selector: 'app-class-room-edit-widget',
  templateUrl: './class-room-edit-widget.component.html',
  styleUrl: './class-room-edit-widget.component.css'
})
export class ClassRoomEditWidgetComponent implements OnInit {
  selectedClasseId!: number;

  @Output() closeModal = new EventEmitter<any>();
  classes: ClassRoom []= [];
  update_classe_form!: FormGroup

  constructor(private classService: ClassStudentService, public icons: IconsService, private pageTitle: PageTitleService, private fb: FormBuilder){}

  ngOnInit(): void {
    this.load_form_class();
    this.load_all_classe();
      
  }
  // ----------------------------------load classes
    load_all_classe(){
      this.classService.getAll().subscribe((res: ClassRoom[]) =>{
        this.classes = res;
        this.load_classe_input_value(res);
      })
    }
    // ---------------------------------load form
    load_form_class(){
      this.update_classe_form = this.fb.group({
        id: [''],
        idFiliere: [''],
        // effectifs: ['', Validators.required],
        scolarite: ['', [Validators.required, Validators.min(100000), Validators.max(3000000)]]
      });
    }
// ----------------------------method update
  update_classe(id: number){
    const formData = this.update_classe_form.value;
    const fliere =  formData.idFiliere;
    const classe : ClassRoom ={
      id: id,
      // effectifs: formData.effectifs,
      scolarite: formData.scolarite,
      idFiliere: fliere
    }
    if(this.update_classe_form.valid){
      this.classService.update_classe(classe).subscribe({
        // console.log(response);
        next: (response) =>{
          this.pageTitle.showSuccessToast(response.message);
          this.closeModal.emit();
        }, 
        error: (erreur) =>{
          this.pageTitle.showErrorToast(erreur.error.message);
        }
      })
    }else{
      this.update_classe_form.markAllAsTouched();
      console.log("invalid", this.update_classe_form.value)
    }
    
  }
  // ---------------------------------------------------------------------
  load_classe_input_value(classes?: ClassRoom[], id?: number){
    const selectClasse = classes!.find(cl => cl.id === id);
    console.log(selectClasse, "class trover")
    this.update_classe_form.get('idFiliere')?.setValue(selectClasse?.idFiliere);
    this.update_classe_form.get('scolarite')?.setValue(selectClasse?.scolarite);
  }
  // ----------------------------
   onClasseChange(event: any) {
    this.selectedClasseId = event.target.value;
    this.load_classe_input_value(this.classes, +event.target.value);
    
  }
  // -------------------------close modal----------------------------------------------
 
  close_modal(){
    this.closeModal.emit();
  }
}

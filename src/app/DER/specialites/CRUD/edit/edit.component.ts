import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Specialites } from '../../../../Admin/Models/Filieres';
import { AdminUSER } from '../../../../Admin/Models/Auth';
import { SpecialiteService } from '../../../../Services/specialite.service';
import { PageTitleService } from '../../../../Services/page-title.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {

  @Input() specialite !: Specialites 
  @Output() closeEdit = new EventEmitter<any>();
  form!: FormGroup
  constructor(private fb: FormBuilder, private specialiteService: SpecialiteService, private pageTitle: PageTitleService){}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.form = this.fb.group({
      id: [this.specialite.id],
      idAdmin: [AdminUSER()?.der],
      nom: [this.specialite.nom, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    });
  }

  // submit form
  submit(){
    const formData = this.form.value;
    const specialite : Specialites ={
      id: formData.id,
      nom: formData.nom,
      idAdmin: formData.idAdmin
    }
    // console.log(specialite, "special")
    // return
    if(this.form.valid){
        this.specialiteService.updateSpecialite(specialite).subscribe({
        next: (res) => {
          this.pageTitle.showSuccessToast(res.message)
          this.closeEdit.emit();  
        },
        error: (err) => this.pageTitle.showErrorToast(err.error.message)  // handle error if update fails
      });
    }else{
      this.form.markAllAsTouched();  // mark all fields as touched to display validation errors in form  // display error message if form is invalid  // mark all fields as touched to display validation errors in form  // display error message if form is invalid   // mark all fields as touched to display validation errors in form  // display error message if form is invalid   // mark all fields as touched to display validation errors in form  // display error message if form is invalid   // mark all fields as touched to display validation errors in form  // display error message if form is invalid   // mark all fields as touched to display validation errors in form  // display error message if form is invalid   // mark all fields as touched to display validation errors in form  // display error message if form is invalid   // mark all fields as touched to display validation errors in form  // display error message if form is invalid   // mark all fields as touched to display validation errors in form
    }
    
  }

  // cancel edit
  cancel(){
    this.closeEdit.emit();  // emit event to parent component to close edit mode
    // cancel edit and reset form
    this.initForm();
  }
}

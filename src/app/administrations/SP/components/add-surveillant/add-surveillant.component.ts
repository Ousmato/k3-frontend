import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SurveillenceService } from '../../services/surveillence.service';
import { returnMessages } from '../../../shared/utils/returnMessages';
import { contructor_dependencies } from '../../../dependencies/dependencies';

@Component({
  selector: 'app-add-surveillant',
  templateUrl: './add-surveillant.component.html',
  styleUrl: './add-surveillant.component.css'
})
export class AddSurveillantComponent implements OnInit{

  private dependencies = inject(contructor_dependencies)
  form!: FormGroup
  @Output() closeModal = new EventEmitter<any>();
  ngOnInit(): void {
      this.load_form();
  }

 
  load_form(){
    this.form = this.dependencies.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', Validators.required],
      
    })
  }


 
  hideForm(){
    this.closeModal.emit()
  }

  submit(){
    const formData = this.form.value
    console.log(formData, "formdata")
    if (this.form.valid) {
      this.dependencies.surveillance.addSurveillants(formData).subscribe({
        next: (data) => {
        
          this.dependencies.queryreturnMessage.showSuccessToast(data.message)
          this.form.reset()
          this.closeModal.emit()
        },
          
        error: (error) => {
          this.dependencies.queryreturnMessage.showErrorToast(error.error.message)
          
        }
      })
    } else {
      console.log("Form is invalid")
    }
  }

}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SemestreService } from '../../Services/semestre.service';
import { Semestres } from '../../Admin/Models/Semestre';
import { IconsService } from '../../Services/icons.service';
import { SetService } from '../../Admin/Views/settings/set.service';
import { PageTitleService } from '../../Services/page-title.service';

@Component({
  selector: 'app-semestre',
  templateUrl: './semestre.component.html',
  styleUrl: './semestre.component.css'
})
export class SemestreComponent implements OnInit {

  @Output() closeModal = new EventEmitter<any>();
  add_semestre!: FormGroup;

  constructor(public icons: IconsService, private setService: SetService, private fb: FormBuilder, private paTitle: PageTitleService){}
  ngOnInit(): void {
      this.loa_form();
  }

  
  loa_form(){
    this.add_semestre = this.fb.group({
      nomSemetre: ['', [Validators.required, Validators.maxLength(40)]],
      dateDebut: ['',Validators.required],
      datFin: ['',Validators.required],

    })
  }

  // ----------------------------method add
  send_semestre(){
    const formData = this.add_semestre.value;
    if(this.add_semestre.valid){
      this.setService.createSemestre(formData).subscribe({
        next: (response) =>{
          this.paTitle.showSuccessToast(response.message);
          this.closeModal.emit();
        },
        error: (erreur) =>{
          this.paTitle.showErrorToast(erreur.error.message)
        }
      })
    }else{
      this.add_semestre.markAllAsTouched();
      console.log("invalid", this.add_semestre.value);
    }
    
  }
 
  // ----------------------------------close modal
  close_modal(){
    this.closeModal.emit();
  }
}

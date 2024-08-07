import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTitleService } from '../../../Services/page-title.service';
import { IconsService } from '../../../Services/icons.service';
import { SalleService } from '../../../Services/salle.service';

@Component({
  selector: 'app-der-salles-add',
  templateUrl: './der-salles-add.component.html',
  styleUrl: './der-salles-add.component.css'
})
export class DerSallesAddComponent implements OnInit{

  
  @Output() closeModal = new EventEmitter<any>();
  add_form!: FormGroup;

  constructor(private pageTitle: PageTitleService, private salleService: SalleService,
    public icons: IconsService, private fb: FormBuilder){}

  ngOnInit(): void {
      this.load_form();
  }

  // ----------------load form
  load_form(){

    this.add_form = this.fb.group({
      nom: ['',[Validators.required, Validators.maxLength(40)]],
      nombrePlace: ['',[Validators.required, Validators.max(1000)]]
    })
  }
  add_salle(){
    const formData = this.add_form.value;

    if(this.add_form.valid){
      this.salleService.add_salle(formData).subscribe({
        next: (res)=>{
          this.pageTitle.showSuccessToast(res.message);
          this.closeModal.emit()
        },
        error: (erreur)=>{
          this.pageTitle.showErrorToast(erreur.error.message);
        }
      })
    }else{
      this.add_form.markAllAsTouched();
    }
  }
  // ----------------------close_modal
  close_modal(){
    // this.overlay = false
    this.closeModal.emit();
  }
}

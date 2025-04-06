import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnneeScolaire } from '../../../../Admin/Models/School-info';
import { PromotionServiceService } from '../../../shared/services/promotion-service.service';
import { errorMessage } from '../../../shared/utils/errorMessage';

@Component({
  selector: 'app-update-promotion',
  templateUrl: './update-promotion.component.html',
  styleUrl: './update-promotion.component.css'
})
export class UpdatePromotionComponent implements OnInit {
  private _promotionsService = inject(PromotionServiceService)
  private _errorMessages = inject(errorMessage)
  
  @Output() closeModal = new EventEmitter<any>();
  @Output() closeModalAfterSuccess = new EventEmitter<any>();

  form!: FormGroup;
  private fb = inject(FormBuilder);

  is_show: boolean = false;
  @Input() promotion!: AnneeScolaire

  ngOnInit(): void {
    this.load_form();
    this.onInitialize();
  }

  load_form() {
    this.form = this.fb.group({
      id: [''],
      debutAnnee: ['', Validators.required],
      finAnnee: ['', Validators.required]
    })
  }

  update_promotion() {
    const formData = this.form.value
    const annee: AnneeScolaire = {
      id: formData.id,
      debutAnnee: formData.debutAnnee,
      finAnnee: formData.finAnnee
    }
    if (this.form.valid) {
      this._promotionsService.updateAnnee(annee).subscribe({
        next: (result) => {
          this._errorMessages.showSuccessToast(result.message);
          this.form.reset();
          this.load_form();
          this.is_show = false
          this.closeModalAfterSuccess.emit();
        },
        error: (erreur) => {
          this._errorMessages.showErrorToast(erreur.error.message);
        }
      })
    }else{
      this.form.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }

  }

  onInitialize(){
    this.form.get('debutAnnee')?.setValue(this.promotion?.debutAnnee);
    this.form.get('finAnnee')?.setValue(this.promotion?.finAnnee);
    this.form.get('id')?.setValue(this.promotion?.id);
  }

  close_update(){
    this.is_show = false
    this.closeModal.emit();
  }
}

import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnneeScolaire } from '../../../../Admin/Models/School-info';
import { AdminUSER } from '../../../shared/models/auth';
import { Admin } from '../../../../Admin/Models/Admin';
import { PromotionServiceService } from '../../../shared/services/promotion-service.service';
import { errorMessage } from '../../../shared/utils/errorMessage';

@Component({
  selector: 'app-add-promotion',
  templateUrl: './add-promotion.component.html',
  styleUrl: './add-promotion.component.css'
})
export class AddPromotionComponent implements OnInit {

  private _promotionsService = inject(PromotionServiceService)
  public _errorsMessage = inject(errorMessage)

  form!: FormGroup;
  private fb = inject(FormBuilder);

  admin!: Admin

  @Output() closeModal = new EventEmitter<any>();
  @Output() closeModalAfterSuccess = new EventEmitter<any>();

  ngOnInit(): void {
    this.admin = AdminUSER()?.dga
    this.load_form();
  }
  load_form() {
    this.form = this.fb.group({
      debutAnnee: ['', Validators.required],
      finAnnee: ['', Validators.required]
    })
  }

  submit() {
    const formData = this.form.value
    const annee: AnneeScolaire = {
      debutAnnee: formData.debutAnnee,
      finAnnee: formData.finAnnee,
      idAdmin: this.admin
    }
    console.log(annee, "promotion");
    // return
    if (this.form.valid) {
      this._promotionsService.addAnnee(annee, this.admin.idAdministra!).subscribe({
        next: (result) => {
          this._errorsMessage.showSuccessToast(result.message);
          this.form.reset();
          this.load_form();
          this.closeModalAfterSuccess.emit();
        },
        error: (erreur) => {
          this._errorsMessage.showErrorToast(erreur.error.message);
        }
      })
    }else{
      // this._errorsMessage.showErrorToast("Veuillez remplir tous les champs obligatoires.");
      this.form.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }

  close_add() {
    this.closeModal.emit();
  }
}

import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {  returnMessages } from '../../utils/returnMessages';
import { IconsService } from '../../../../Services/icons.service';
import { PromotionServiceService } from '../../services/promotion-service.service';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css'
})
export class ConfirmationModalComponent {
  private _promotionService = inject(PromotionServiceService);
  private _errorMessages = inject(returnMessages);
    public icons = inject(IconsService);
    @Output() closeModal = new EventEmitter<any>();
  
    @Input() confirmationMessage: string = '';
    @Input() confirmationTitle: string = 'Confirmation';
    @Input() confirmationObjet: any; // 'delete' or 'update'
    is_show: boolean = false;
    isConfirm: boolean = false;

    desabled(idAnnee : number){
      this._promotionService.deleteAnnee(idAnnee).subscribe({
        next: (result) =>{
          this._errorMessages.showSuccessToast(result.message);
          this.isConfirm = false
          this.closeModal.emit();
        },
        error: (erreur) =>{
          this._errorMessages.showErrorToast(erreur.error.message);
         
        }
      })
      
    }
  
    exitDelete(){
      this.isConfirm = false;
      this.closeModal.emit();
  
    }
}

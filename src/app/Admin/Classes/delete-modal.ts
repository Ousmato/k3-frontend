// toastr.service.ts

import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrNotificationService {

  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, title: string = 'Succès', options?: Partial<IndividualConfig>) {
    const defaultOptions: Partial<IndividualConfig> = {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true,
      tapToDismiss: true,
      titleClass: 'toast-title',
      messageClass: 'toast-message',
      ...options // Fusionne les options personnalisées avec les options par défaut
    };

    this.toastr.success(message, title, defaultOptions);
  }

  // Ajoutez d'autres méthodes pour gérer les notifications d'erreur, d'avertissement, etc.
}

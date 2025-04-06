import { inject, Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})

export class errorMessage {

    private toastr = inject(ToastrService)
    
  showSuccessToast(message: any) {
    this.toastr.success(message, `Succès`);
    
  }
  showErrorToast(erreur: any) {
    this.toastr.error(erreur, `Erreur`)
  }
}
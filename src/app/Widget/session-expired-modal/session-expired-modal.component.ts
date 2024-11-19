import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthServiceService } from '../../auth-service.service';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-session-expired-modal',
  templateUrl: './session-expired-modal.component.html',
  styleUrl: './session-expired-modal.component.css'
})
export class SessionExpiredModalComponent implements OnInit {

  @Input() value: any
  @Input() showModal = false;
  @Input() alert = false;
 @Input() newAlert = false;
 @Input() heure! : any
 @Input() date! : any
 @Input() minutes: any = 0
  cancelTime: number = 0; // Heure à laquelle l'alerte a été annulée
  alertTimeout: any;
  @Output() alertTime = new EventEmitter<number>();

  constructor(private authService: AuthServiceService) {}

  ngOnInit(): void {
    // this.loadModal();
    // // if(this.heure && this.date){
    // //   this.alert = true;
    // // }
   
  }
  redirectToLogin() {
    this.authService.logout();
    // this.closeModal();
    this.showModal = false;
  }

  loadModal(){
    console.log(this.value, "date expired")
    
    if(this.value && (this.value === 401 || this.value === 403)){
      this.showModal = true;
      return
    }else{
     
      this.alert = true
    }
  }
  annuler(){
    this.cancelTime = Date.now();
    console.log(this.cancelTime,"cancelTime");
    this.alert = false

    this.alertTime.emit(this.cancelTime);
    // clearTimeout(this.alertTimeout); // Annuler tout ancien timeout

    // // Définir un nouveau timeout de 10 minutes
    // this.alertTimeout = setTimeout(() => {
    //   this.alert = false;
    // }, 1* 60 * 1000); 
  }
 


}

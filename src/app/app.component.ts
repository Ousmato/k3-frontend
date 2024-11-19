import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventServiceService } from './Services/event-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements OnInit {
  title = 'Gestion-scolaire';
  showModal = false;
  alertModal = false;
  appSession = false;
  value?:any;
  heure?:any;
  date?:any;
  minutes?: number;
  dateNow!: any; // Heure à laquelle l'alerte a été annulée
  alertTimeout: any;
  alerMinutea : boolean  = false;



  constructor(private router: Router, private eventService: EventServiceService) {}

  ngOnInit(): void {

    this.eventService.event$.subscribe(event => {

        // on stocke la valeur du subscribe dans une variable pour pouvoir l'utiliser dans le template ici
      console.log(event, "evenement de modal d'expiration de session");
      if(event === 401 || event === 403){
        this.value = event;
        this.appSession = true;
        this.showModal = true;
        this.alertModal = false
        this.alerMinutea = false
        console.log(this.showModal, "state modal d'expiration")
        return;
      }else if(event.includes('expire date.')){

        this.value = event
        this.heure = this.value.split('T')[1].split('.')[0]; // Récupérer l'heure avant la fraction de seconde
        this.date = this.value.split('expire date.')[1].split('T')[0]; // Récupérer la date
        console.log(this.date);    // Affichera "2024-11-15"
        console.log(this.heure);
        this.appSession = true
        this.alertModal = true;
        console.log(this.dateNow, "Calculating");



        if (this.dateNow && typeof this.dateNow === "number") {
          const timeDiff = Date.now() - this.dateNow;  // Calcule la différence de temps en millisecondes
          if (timeDiff >= 1 * 60 * 1000) {  // Vérifie si plus d'une minute s'est écoulée
            this.appSession = true  
            this.alerMinutea = true;
              console.log(this.alerMinutea, "Calculating");
          }
          this.dateNow = null
      } else {
          console.error("this.dateNow n'est pas un timestamp valide.");
      }
   
       return
      }
      
    })

    
  }

  canceled(event: number){
   
    this.dateNow =event
    this.appSession = false
    console.log("Date-------------- : ", this.dateNow);
   
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  isAdminPage(): boolean {
    console.log(this.router.url)
    return this.router.url.startsWith('/sidebar');
  }

  isStudentPage(): boolean {
    return this.router.url.startsWith('/student-dashboard');
  }
}

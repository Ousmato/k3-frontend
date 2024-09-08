import { Component, OnInit } from '@angular/core';
import { Configure_seance } from '../../Admin/Models/Configure_seance';
import { SeancService } from '../../Admin/Views/emplois-seance/seanc.service';
import { Router } from '@angular/router';
import { Surveillance, type_seance } from '../../Admin/Models/Seances';
import { Emplois } from '../../Admin/Models/Emplois';

@Component({
  selector: 'app-sec-surveillance',
  templateUrl: './sec-surveillance.component.html',
  styleUrl: './sec-surveillance.component.css'
})
export class SecSurveillanceComponent implements OnInit{

  surveillance: Configure_seance[] = [];
  diff_heure!: number
  
  seanceTypeOptions: { key: string, value: string }[] = [];
  constructor(private seanceService: SeancService, private router: Router){}

  ngOnInit(): void {
      this.load_config();
      this.getStatusOptions();
  }

  load_config(){
    this.seanceService.get_configByExamOrSession().subscribe(data => {
      this.surveillance = data;
      console.log(this.surveillance, "surveillance")
      
      this.load_diff(this.surveillance)
    })
  }
// ---------------------go to list emplois
  toggle_toListEmplois(){
    this.router.navigate(['/secretaire/emplois-du-temps'])
  }
  getStatusOptions() {
    const objet = Object.keys(type_seance).map(key => ({
      
      key: key,
      value: type_seance[key as keyof typeof type_seance] 
    }));
    objet.forEach(o => {
      if(o.value == type_seance.SESSION || o.value == type_seance.Examen ){
        this.seanceTypeOptions.push(o)
      }
    })
  }
  // ---------------------calculate diff heure
  load_diff(configList: Configure_seance[]){
    configList.forEach(sv => {
      let heure_Debut = new Date('1970-01-01T' + sv.idSeance?.heureDebut);
      let heure_Fin = new Date('1970-01-01T' + sv.idSeance?.heureFin );
      console.log(sv.idSeance?.heureFin, "heure fin")
      // Calculer la différence en millisecondes
      let differenceMs = heure_Fin.getTime() - heure_Debut.getTime();
  
      // Convertir la différence de millisecondes en heures et minutes
      let differenceMinutes = Math.floor(differenceMs / (1000 * 60));
      let differenceHours = Math.floor(differenceMinutes / 60);
      let remainderMinutes = differenceMinutes % 60;
     
      sv.heure = differenceHours;
      sv.munite = remainderMinutes;
      this.diff_heure  = sv.heure;
  
    console.log(this.diff_heure, "heure diff")
    })
   
}
}

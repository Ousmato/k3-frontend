import { Component, OnInit } from '@angular/core';
import { SeancService } from '../../DER/EDT/Services/seanc.service';
import { Router } from '@angular/router';
import { type_seance } from '../../DER/EDT/Models/Seances';

@Component({
  selector: 'app-sec-surveillance',
  templateUrl: './sec-surveillance.component.html',
  styleUrl: './sec-surveillance.component.css'
})
export class SecSurveillanceComponent implements OnInit{

  diff_heure!: number
  
  seanceTypeOptions: { key: string, value: string }[] = [];
  constructor(private seanceService: SeancService, private router: Router){}

  ngOnInit(): void {
      this.getStatusOptions();
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
 
}

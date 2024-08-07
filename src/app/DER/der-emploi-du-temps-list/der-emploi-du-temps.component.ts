import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../emplois-du-temps/service.service';
import { Emplois } from '../../Admin/Models/Emplois';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-der-emploi-du-temps',
  templateUrl: './der-emploi-du-temps.component.html',
  styleUrl: './der-emploi-du-temps.component.css'
})
export class DerEmploiDuTempsComponent implements OnInit{

  emplois : Emplois[]=[];
  constructor(private emploisService: ServiceService, private router: Router){}

  ngOnInit(): void {
      this.load_all_emplois_actif();
  }

  load_all_emplois_actif(){
    this.emploisService.getAllEmploisActifs().subscribe(data =>{
      this.emplois = data;
    })
  }
// ----------------------------go to seance by id emplois
  toggle_toSeance(idClasse : number){
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idClasse }
    };
    this.router.navigate(['/der/emplois-seances'], navigationExtras);
  }
}

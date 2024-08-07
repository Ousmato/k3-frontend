import { Component, OnInit } from '@angular/core';
import { IconsService } from '../../Services/icons.service';
import { FormGroup } from '@angular/forms';
import { Salles } from '../../Admin/Models/Salles';
import { SalleService } from '../../Services/salle.service';

@Component({
  selector: 'app-der-salles',
  templateUrl: './der-salles.component.html',
  styleUrl: './der-salles.component.css'
})
export class DerSallesComponent implements OnInit {

  show_add_form: boolean = false
 overlay : boolean = false
  salles: Salles [] =[];
  salles_occuper : Salles[] =[];
  constructor(public icons: IconsService, private saleService: SalleService){}

  ngOnInit(): void {
      this.load_salles();
      this.get_salles_occuper();
  }

  load_salles(){
    this.saleService.getAll().subscribe(data =>{
      this.salles = data;
      console.log(this.salles, "salles")
    })
  }
  // -----------------------form add
  toggle_form_add(){
    this.overlay =! this.overlay
    this.show_add_form =! this.show_add_form
    this.load_salles();
  }
  // ----------------get all salle occuper
  get_salles_occuper(){
    this.saleService.getSallesOccuper().subscribe(data =>{
      this.salles_occuper = data;
      console.log(this.salles_occuper, "salle occuper")
    })
  }

    // Méthode pour vérifier si une salle est occupée
    isSalleOccupee(id: number): boolean {
      return this.salles_occuper.some(salle => salle.id === id);
    }
  
}

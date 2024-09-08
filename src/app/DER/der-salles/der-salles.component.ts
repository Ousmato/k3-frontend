import { Component, OnInit } from '@angular/core';
import { IconsService } from '../../Services/icons.service';
import { FormGroup } from '@angular/forms';
import { Salles } from '../../Admin/Models/Salles';
import { SalleService } from '../../Services/salle.service';
import { SideBarService } from '../../sidebar/side-bar.service';

@Component({
  selector: 'app-der-salles',
  templateUrl: './der-salles.component.html',
  styleUrl: './der-salles.component.css'
})
export class DerSallesComponent implements OnInit {

  show_add_form: boolean = false
  salles : Salles [] = []
  overlay : boolean = false
  searchTerm: string = '';
  filteredSalle: Salles [] = [];
  salle_E1: Salles [] = []
  salles_E2: Salles [] = [];
  salles_E3: Salles [] = [];
  amphies : Salles [] = []
  salles_occuper : Salles[] =[];
  constructor(public icons: IconsService, private saleService: SalleService, private sideBarService: SideBarService){}

  ngOnInit(): void {
      this.load_salles();
      this.get_salles_occuper();
      this.sideBarService.currentSearchTerm.subscribe(term => {
        this.searchTerm = term;
        this.filteredSalles();
        this.filteredSallesE2();
        this.filteredSallesE3();
        this.filteredSallesR();

      
      });
  }

  load_salles(){
    
    this.saleService.getAll().subscribe(data =>{
     this.salles = data
      data.forEach(sal =>{
        if(sal.nom.includes('E1')){
          this.salle_E1.push(sal)
        }
          
        else if(sal.nom.includes('E2')){
           this.salles_E2.push(sal)
        console.log(this.salles_E2, "salle E2");
        }
         
        else if(sal.nom.includes('E3')){
           this.salles_E3.push(sal)
        }
        else{
          this.amphies.push(sal)
        }
      })
    })
  }
  // -----------------------form add
  toggle_form_add(){
    this.overlay =! this.overlay
    this.show_add_form =! this.show_add_form
    this.salle_E1 = [];
    this.salles_E2 = [];
    this.salles_E3 = [];
    this.amphies = [];
    this.load_salles();
    this.get_salles_occuper();
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
  
    refreshe(){
     
      this.load_salles()
    }

    filteredSalles(){
      if(!this.searchTerm){
        return this.filteredSalle = this.salle_E1;
      }
     return this.filteredSalle = this.salle_E1.filter(sal => sal.nom.toLowerCase().includes(this.searchTerm.toLowerCase()))
    }
    filteredSallesE2(){
      if(!this.searchTerm){
        return this.filteredSalle = this.salles_E2;
      }
     return this.filteredSalle = this.salles_E2.filter(sal => sal.nom.toLowerCase().includes(this.searchTerm.toLowerCase()))
    }
    filteredSallesE3(){
      if(!this.searchTerm){
        return this.filteredSalle = this.salles_E3;
      }
     return this.filteredSalle = this.salles_E3.filter(sal => sal.nom.toLowerCase().includes(this.searchTerm.toLowerCase()))
    }
    filteredSallesR(){
      if(!this.searchTerm){
        return this.filteredSalle = this.amphies;
      }
     return this.filteredSalle = this.amphies.filter(sal => sal.nom.toLowerCase().includes(this.searchTerm.toLowerCase()))
    }
}

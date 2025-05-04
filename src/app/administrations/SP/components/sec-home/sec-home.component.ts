import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { contructor_dependencies } from '../../../dependencies/dependencies';
import { Emplois } from '../../../DER/models/Emplois';

@Component({
  selector: 'app-sec-home',
  templateUrl: './sec-home.component.html',
  styleUrl: './sec-home.component.css'
})
export class SecHomeComponent implements OnInit{

  emplois: Emplois [] = []
  form!: FormGroup
  searchTerm : string = ""
  filteredEmploisItem: Emplois[] = []

  public dependencies = inject(contructor_dependencies)
 
  ngOnInit(): void {
    this.getAllCurrentEmplois()
  }

  
  getAllCurrentEmplois(){
    this.dependencies.emploiService.getAllEmploisActifs_with_seances().subscribe(data =>{
      this.emplois = data
      this.filteredEmploisItem = data
      console.log(this.emplois, "emplois")
    })
  }


  onSearch(searchTerm: string) {
    this.filteredEmploisItem = this.emplois.filter(e => e.idClasse.idFiliere?.idNiveau
      .nom?.toLowerCase().includes(searchTerm.toLowerCase()) || e.idClasse.idFiliere?.idFiliere.nomFiliere
      .toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // filteredEmplois(){
  //   if(!this.searchTerm){
  //     return this.filteredEmploisItem = this.emplois
  //   }
  //   return this.filteredEmploisItem = this.emplois.filter(e => e.idClasse.idFiliere?.idNiveau
  //     .nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) || e.idClasse.idFiliere?.idFiliere.nomFiliere
  //     .toLowerCase().includes(this.searchTerm.toLowerCase())
  //   )
  // }

  gotoEmploi(idEmploi: number){
      const navigationExtras : NavigationExtras ={
        queryParams : {
          id: idEmploi
        }
  
      }
      this.dependencies.router.navigate(['/secretaire/emplois-seances'], navigationExtras)
    }
}

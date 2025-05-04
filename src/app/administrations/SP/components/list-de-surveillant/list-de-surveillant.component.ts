import { Component, inject, OnInit } from '@angular/core';
import { surveillants } from '../../models/surveillence';
import { contructor_dependencies } from '../../../dependencies/dependencies';

@Component({
  selector: 'app-list-de-surveillant',
  templateUrl: './list-de-surveillant.component.html',
  styleUrl: './list-de-surveillant.component.css'
})
export class ListDeSurveillantComponent implements OnInit{

  showAdd: boolean = false
  surveillants: surveillants[] = []
  searchTerm : string = ""
  filteredItems : surveillants [] =[]

  public dependencies = inject(contructor_dependencies)

  ngOnInit(): void {
    this.getAllSurveillants()

  }

  getAllSurveillants(){
    this.dependencies.surveillance.getAllSurveillants().subscribe(resulta => {
      this.surveillants = resulta
      this.filteredItems  = this.surveillants
    })
  }

  showAddApp(){
    this.showAdd = true
  }

  hideForm(){
    this.showAdd = false
    this.getAllSurveillants()
  }

  onSearch(searchTerm: string) {
    this.filteredItems = this.surveillants.filter(item =>
      item.nom.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

}

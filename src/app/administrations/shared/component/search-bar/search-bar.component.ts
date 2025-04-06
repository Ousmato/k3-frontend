import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  searchTerm: string = '';

  @Output() search: EventEmitter<any> = new EventEmitter<string>();
  constructor() { }

  onSearch() {
    // Émettre l'événement de recherche instantanément
    this.search.emit(this.searchTerm);
  }

}

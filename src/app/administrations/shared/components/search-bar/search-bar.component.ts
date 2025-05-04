import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  @Input() searchTerm: string = '';

  @Output() search: EventEmitter<any> = new EventEmitter<string>();
  constructor() { }

  onSearch() {
    // Émettre l'événement de recherche instantanément
    this.search.emit(this.searchTerm);
    console.log(this.searchTerm, "term")
  }

}

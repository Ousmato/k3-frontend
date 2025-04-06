import { Component, inject, OnInit } from '@angular/core';
import { AnneeScolaire } from '../../../../Admin/Models/School-info';
import { PromotionServiceService } from '../../../shared/services/promotion-service.service';
import { utils } from '../../../shared/utils/utils';
import { IconsService } from '../../../../Services/icons.service';

@Component({
  selector: 'app-promotions-liste',
  templateUrl: './promotions-liste.component.html',
  styleUrl: './promotions-liste.component.css'
})
export class PromotionsListeComponent implements OnInit {
  private _promotionsService = inject(PromotionServiceService)
  public utils = inject(utils)
  public icons = inject(IconsService)

  Ishow_add: boolean = false;
  isconfirmed: boolean = false;
  ishow_update: boolean = false
  items : AnneeScolaire [] = []

  indexSelected!: number
  confirmationMessage : string = "Voulez-vous vraiment supprimer cette promotion ? "
  filteredItems: AnneeScolaire[] = [];

  ngOnInit(): void {
   this.getAllPromotions();
  }
  getAllPromotions(){
    this._promotionsService.getAll_annee().subscribe(result => {
      this.items = result;
      console.log(this.items, "items")
      this.filteredItems = result; // Initialize filteredItems with all items
    })
  }
  onSearch(searchTerm: string) {
    this.filteredItems = this.items.filter(item =>
      item.debutAnnee.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  showAddModalAdd(){
      this.Ishow_add = true
  }
  showAddModalUpdate(index: number){
    this.indexSelected = index;
      this.ishow_update = true
  }
  showAddModalConfirm(index: number){
    this.indexSelected = index;
      this.isconfirmed = true
  }
  closeModal() {
    
    
      this.ishow_update = false
    
      this.Ishow_add = false
      this.isconfirmed = false
  }
  afterSuccess(){
    this.Ishow_add = false
    this.ishow_update = false
    this.getAllPromotions();
  }
}

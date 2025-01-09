import { Component, OnInit } from '@angular/core';
import { Filiere, filiereSpecialite, Specialites } from '../../Admin/Models/Filieres';
import { IconsService } from '../../Services/icons.service';
import { SpecialiteService } from '../../Services/specialite.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminUSER } from '../../Admin/Models/Auth';
import { PageTitleService } from '../../Services/page-title.service';
import { FiliereService } from '../../Services/filiere.service';

@Component({
  selector: 'app-specialites',
  templateUrl: './specialites.component.html',
  styleUrl: './specialites.component.css'
})
export class SpecialitesComponent  implements OnInit{

  searchTerm: string = '';
  specialites: Specialites [] = [];
  filieres: Filiere [] = [];
  filieresChecked : Filiere[] = [];
  specialiteItems: filiereSpecialite [] = [];
  filiereSpecialite: filiereSpecialite [] = [];
  permission: boolean = false;
  show_add: boolean = false;
  show_edit: boolean = false;
  show_filiere: boolean = false;
  index !:number
  addSpecialiteForm! : FormGroup

  constructor(public icons: IconsService, private pageTitle: PageTitleService, private filieresService: FiliereService,
    private specialiteService: SpecialiteService, private fb: FormBuilder){}

  ngOnInit(): void {
      this.loadForm();
      this.loadFilieres();
      this.loadSpecialites()
  }

  loadForm(){
    this.addSpecialiteForm = this.fb.group({
      nom: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(40)]]
    })
  }

  //submit form
  addSpecialite(){
    const formData = this.addSpecialiteForm.value;
    const specialite : Specialites ={
      nom: formData.nom,
      idAdmin: AdminUSER()?.der
    }
    if(this.addSpecialiteForm.valid){
      this.specialiteService.addSpecialite(specialite, this.filieresChecked).subscribe( {
        next: (res) => {
          this.pageTitle.showSuccessToast(res.message);
          this.loadForm();
          this.loadSpecialites();
          this.filieresChecked = []
          this.show_add = false
        },
        error: (erreur) => {
          this.pageTitle.showErrorToast(erreur.error.message);
        }
      })
    }else{
      this.addSpecialiteForm.markAllAsTouched();
    }
  }

  //load specialites
  loadSpecialites(){
    this.specialiteService.getFiliereSpecialite().subscribe(specialite =>{
      this.filiereSpecialite = specialite;
      console.log(this.filiereSpecialite, "specialite-loaded");
    })
  }

  //load filieres
  loadFilieres(){
    this.filieresService.getAll_filiere().subscribe(filieres =>{
      this.filieres = filieres;
    })
  }
  //filtered specialites
  filteredSpecialite(){
    if(!this.searchTerm){
     return this.specialiteItems = this.filiereSpecialite;
    }
    return this.specialiteItems = this.filiereSpecialite.filter(sp => sp.specialite.nom.toLowerCase().includes(this.searchTerm.toLowerCase()))
  }

  // show add form
  nouveau(){
    this.show_add = true;
  }
  // exit
  exite(){
    this.show_add = false;
    this.show_edit = false;
    this.loadSpecialites();
  }

  // select filieres
  filiere_check(idFilier: number, event: any){
    const filiere = this.filieres.find(fl => fl.id === idFilier);
    if(event.target.checked){
    if(!this.filieresChecked.some(fl => fl.id === filiere?.id)){
      this.filieresChecked.push(filiere!);
    }
  }else{
    this.filieresChecked = this.filieresChecked.filter(fl => fl.id !== filiere?.id)
  }
    console.log(this.filieresChecked, "filiere selected")
  }

  //is filieres selected
  show_edited(index: number){
    this.index = index;
    this.show_edit =! this.show_edit;
    console.log("edit show", this.show_edit)
  }

  // show filieres
  showFilieres(index: number){
    this.index = index;
    this.show_filiere =! this.show_filiere;
    console.log("filiere show", this.show_filiere)
  }
  // abrevigate filieres
  abreviateFiliereName(name: string){
    const nameSplit = name.split(' ');
    return nameSplit.filter(word => word.length > 3).map(w => w[0].toUpperCase()).join('');
  }
}

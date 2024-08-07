import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Filiere } from '../../Admin/Models/Filieres';
import { Niveau } from '../../Admin/Models/Niveau';
import { NivFiliere } from '../../Admin/Models/NivFiliere';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../Services/icons.service';
import { SetService } from '../../Admin/Views/settings/set.service';
import { PageTitleService } from '../../Services/page-title.service';

@Component({
  selector: 'app-filiere-edit-widget',
  templateUrl: './filiere-edit-widget.component.html',
  styleUrl: './filiere-edit-widget.component.css'
})
export class FiliereEditWidgetComponent implements OnInit{

  @Output() closeModal = new EventEmitter<any>();
  update_filiere_form!: FormGroup;

  selectedFiliereId!: number
  objectNivFil: NivFiliere [] = [];

  constructor(public icons: IconsService, private setService: SetService, private fb: FormBuilder,
    private pageTitle: PageTitleService){}

  ngOnInit(): void {
      this.load_filiere_form();
      this.load_niveau();
  }

   // -------------------------------------------------------
   load_filiere_form(){
    this.update_filiere_form = this.fb.group({
      id: [''],
      idFiliere: ['', [Validators.required, Validators.maxLength(40)]],
      idNiveau: ['', Validators.required]
    });
  }
  // ----------------------load niveau
  load_niveau(){
    this.setService.getAll_Niveau_filiere().subscribe((
      nivFil: NivFiliere[]) =>{
        this.objectNivFil = nivFil;
        // this.load_filiere_input_value(nivFil)
      })
  }
   // --------------------------------------------------------------
   update_filiere(id: number){
    const formData = this.update_filiere_form.value;
    const object = this.objectNivFil.find(fl => fl.id == id);

    const f: Filiere ={
      id: object?.idFiliere.id,
      nomFiliere: formData.idFiliere

    }

    const n: Niveau ={
      id: object?.idNiveau.id!,
      nom: formData.idNiveau
    }
    const filiere: NivFiliere = {
      id: id,
      idFiliere: f,
      idNiveau: n
    };
    if(this.update_filiere_form.valid){
        this.setService.updateNiveauFiliere(filiere).subscribe({
          next: (reesponse) =>{
            this.pageTitle.showSuccessToast(reesponse.message);
            this.closeModal.emit();
          },
          error: (erreur) =>{
            this.pageTitle.showErrorToast(erreur.error.message);
          }
       
      })
    }else{
      this.update_filiere_form.markAllAsTouched();
      console.log("invalid", this.update_filiere_form.value);
    }
    
  }

  // ------------------------------
  onFiliereChange(event : any){
    this.selectedFiliereId = event.target.value;
    
    const selectFiliere = this.objectNivFil?.find( fil => fil.idFiliere.id == +this.selectedFiliereId)!;
    console.log(selectFiliere, "filier selected id")
    this.update_filiere_form.get('idFiliere')?.setValue(selectFiliere?.idFiliere.nomFiliere);
    this.update_filiere_form.get('idNiveau')?.setValue(selectFiliere?.idNiveau.nom);

  }

  // ----------------------close modal
  close_modal(){
    this.closeModal.emit();
  }
}

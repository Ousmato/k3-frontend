import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../Services/icons.service';
import { SetService } from '../../Admin/Views/settings/set.service';
import { Niveau } from '../../Admin/Models/Niveau';
import { Filiere } from '../../Admin/Models/Filieres';
import { PageTitleService } from '../../Services/page-title.service';

@Component({
  selector: 'app-add-filiere-widget',
  templateUrl: './add-filiere-widget.component.html',
  styleUrl: './add-filiere-widget.component.css'
})
export class AddFiliereWidgetComponent implements OnInit {

  @Output() closeModal = new EventEmitter<any>();
  addFiliere!: FormGroup;
  niveaux: Niveau [] = []

  constructor(public icons: IconsService, private setingService: SetService, private fb: FormBuilder, private pageTitle: PageTitleService){}

  ngOnInit(): void {
    this.loa_filiere_form();
    this.load_niveau();
      
  }

   // ----------------------get liste niveau-------------------------------------
   load_niveau(){
      this.setingService.getAll().subscribe((niveaux: Niveau[]) => {
      this.niveaux = niveaux;
      
    });
   }
   
  // --------------------------load filiere form 
  loa_filiere_form(){
    this.addFiliere = this.fb.group({
      idNiveau: ['',Validators.required],
      nomFiliere: ['',[Validators.required, Validators.maxLength(40)]]
    });
   
  }
   // --------------------------send filiere to backend---------------------------------
   send(){
    const formData = this.addFiliere.value;
    const niveau: Niveau = this.niveaux.find(niv => niv.id === +formData.idNiveau)!;

    const filiere: Filiere = {
      nomFiliere: formData.nomFiliere
    };
    if(this.addFiliere.valid){
      this.setingService.createFiliere(filiere).subscribe(createdFiliere => {
        const nivFiliere = {
          idNiveau: niveau,
          idFiliere: createdFiliere
        };
  
        this.setingService.addFiliere(nivFiliere).subscribe({
          next: (response) => {
           
            this.pageTitle.showSuccessToast(response.message);
            this.closeModal.emit();
            // this.load_ues();
          },
          error: (erreur) => {
            this.pageTitle.showErrorToast(erreur.error.message);
          }
        })
      }, error => {
        console.error('Erreur lors de la création de la filiere', error);
      });
    }else{
      this.addFiliere.markAllAsTouched();
      console.log(this.addFiliere.value, "invalid");
    }
    
  }

  // ------------------------------------close modal
  close_modal(){
    this.closeModal.emit();
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Filiere } from '../../Admin/Models/Filieres';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../Services/icons.service';
import { PageTitleService } from '../../Services/page-title.service';
import { SetService } from '../../Admin/Views/settings/set.service';
import { NivFiliere } from '../../Admin/Models/NivFiliere';

@Component({
  selector: 'app-filiere-widget',
  templateUrl: './filiere-widget.component.html',
  styleUrl: './filiere-widget.component.css'
})
export class FiliereWidgetComponent implements OnInit {

  
  @Output() closeModal = new EventEmitter<any>();
  update_filiere_form!: FormGroup;
  addFiliere!: FormGroup;
  ishow_update: boolean = false
  ishow_add: boolean = false
  show_deleted: boolean = false
  isConfirm: boolean = false
  filiereFordelete?: Filiere

  objectNivFil: NivFiliere [] = [];
  filieres: Filiere[] = []

  constructor(public icons: IconsService, private setingService: SetService, private setService: SetService, private fb: FormBuilder,
    private pageTitle: PageTitleService){}

  ngOnInit(): void {
      this.load_filiere_form();
      this.load_addForm();
  }
    
  // --------------------------load filiere form 
  load_addForm(){
    this.addFiliere = this.fb.group({
      // idNiveau: ['',Validators.required],
      nomFiliere: ['',[Validators.required, Validators.maxLength(40)]]
    });
   
  }
   // --------------------------send filiere to backend---------------------------------
   send(){
    const formData = this.addFiliere.value;
    const filiere: Filiere = {
      nomFiliere: formData.nomFiliere
    };
    if(this.addFiliere.valid){
        this.setingService.createFiliere(filiere).subscribe({
          next: (response) => {
           
            this.pageTitle.showSuccessToast(response.message);
            this.addFiliere.reset();
            this.load_addForm()
            this.ishow_add = false
            this.loa_filiere();
            this.closeModal.emit();
            // this.load_ues();
          },
          error: (erreur) => {
            this.pageTitle.showErrorToast(erreur.error.message);
          }
        })
      
    }else{
      this.addFiliere.markAllAsTouched();
      console.log(this.addFiliere.value, "invalid");
    }
    
  }



   // -------------------------------------------------------
   load_filiere_form(){
    this.update_filiere_form = this.fb.group({
      id: [''],
      nomFiliere: ['', [Validators.required, Validators.maxLength(40)]],
      // idNiveau: ['', Validators.required]
    });
  }
  // ----------------------load niveau
  loa_filiere(){
    this.setService.getAll_filiere().subscribe( result =>{
        this.filieres = result
        console.log(this.filieres, "filiere")
      })
  }
   // --------------------------------------------------------------
   update_filiere(){
    const formData = this.update_filiere_form.value;
   
    const f: Filiere ={
      id: formData.id,
      nomFiliere: formData.nomFiliere

    }
    // console.log(f, "filiere")
    if(this.update_filiere_form.valid){
        this.setService.updateFiliere(f).subscribe({
          next: (reesponse: { message: any; }) =>{
            this.pageTitle.showSuccessToast(reesponse.message);
            this.update_filiere_form.reset();
            this.loa_filiere();
            this.ishow_add = false
            this.load_filiere_form()
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
    const idSelect = event.target.value
    const selectFiliere = this.filieres?.find( fil => fil.id == idSelect)!;
    console.log(selectFiliere, "filier selected id")
    this.update_filiere_form.get('nomFiliere')?.setValue(selectFiliere?.nomFiliere);
    this.update_filiere_form.get('id')?.setValue(selectFiliere?.id);

  }

  // ----------------------close modal
  close_add(){
    this.ishow_add = false;
    this.closeModal.emit();
  }
  close_update(){
    this.loa_filiere();
    this.ishow_update = false;
    this.closeModal.emit();
  }

  // ------------------on delete 
  onDelete(event: any){
    this.isConfirm = true
    this.filiereFordelete = this.filieres?.find( fil => fil.id == event.target.value)!;
    this.show_deleted = false
  }

  annuler(){
    this.show_deleted = false;
    this.closeModal.emit();

  }

  exitDelete(){
    this.isConfirm = false
    this.closeModal.emit()
  }

  delete_niveau(idSelect: number){

    this.setService.deleteFiliere(idSelect).subscribe({
      next: (response) => {
        this.pageTitle.showSuccessToast(response.message);
        this.loa_filiere();
        this.isConfirm = false
        this.closeModal.emit();
      },
      error: (error) => {
        this.pageTitle.showErrorToast(error.error.message);
      }
    })
  }
  show_added(){
    this.ishow_add = true
    this.closeModal.emit();
  }
  show_updated(){
    this.ishow_update = true;
    this.closeModal.emit();
  }

  show_delete(){
    this.show_deleted = true
    this.closeModal.emit();
  }
  nextToConfirm(){
    this.isConfirm = true
    this.closeModal.emit();
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Niveau, NiveauEnum } from '../../Admin/Models/Niveau';
import { SetService } from '../../Admin/Views/settings/set.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../Services/icons.service';
import { PageTitleService } from '../../Services/page-title.service';
import { NiveauService } from '../../Services/niveau.service';

@Component({
  selector: 'app-niveau-widget',
  templateUrl: './niveau-widget.component.html',
  styleUrl: './niveau-widget.component.css'
})
export class NiveauWidgetComponent implements OnInit{

  show_deleted: boolean = false
  show_add: boolean = false
  ishow_update: boolean = false
  isConfirm: boolean = false
  @Output() closeModal = new EventEmitter<any>();
  niveaux: Niveau[] =[]
  formAdd!: FormGroup

  formUpdate!: FormGroup
  niveauForDeleted!: Niveau 
  niveaux_type : {key: string, value: string}[] = []

  constructor(private setingService: SetService, public icons: IconsService, private niveauService: NiveauService,
    private fb: FormBuilder, private pageTitle: PageTitleService,  ) { }


  ngOnInit(): void {
    this.load_niveau();
    this.load_formAdd();
    this.load_formUpdate();
    this.niveaux_type = this.getNiveauType();
      
  }


   // ----------------------get liste niveau-------------------------------------
   load_niveau(){
    this.niveauService.getAll().subscribe((niveaux: Niveau[]) => {
    this.niveaux = niveaux;
    
  });
 }
  // ----------------------delete niveau-------------------------------------
  show_delete(){
    this.show_deleted =! this.show_deleted
    this.closeModal.emit();

  }

  // ------------------on change
  onChange(event: any) {
    const idSelect = event.target.value
    const niveau = this.niveaux.find(n =>n.id == idSelect)
    this.formUpdate.get("nom")?.setValue(niveau?.nom)
    this.formUpdate.get("id")?.setValue(niveau?.id)

  }
  // ---------------------------------on delete
  onDelete(event : any){
   const idSelect = event.target.value

   this.niveauForDeleted = this.niveaux.find(n => n.id == idSelect)!
    
    this.show_deleted = false
    this.isConfirm = true;
    // this.closeModal.emit();
  }
  show_updated(){
    this.ishow_update =! this.ishow_update;
   this.closeModal.emit()
  }

  show_added(){
    this.show_add =! this.show_add;
    this.closeModal.emit()
  }

  exitUpdate(){
    this.ishow_update = false
    this.closeModal.emit()
    this.load_formUpdate();
  }
  exitAdd(){
    this.show_add = false
    this.closeModal.emit()
    this.load_formAdd();
  }
  exitDelete(){
    this.isConfirm = false

    this.closeModal.emit()
  }
  exit(){
    this.ishow_update = false
  }
  nextToConfirm(){
    this.isConfirm = true
    this.closeModal.emit();
  }

 annuler(){
  this.show_deleted = false
  this.closeModal.emit()
 }

  // ---------------------add
  load_formAdd(){
    this.formAdd = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(40)]]
    })
  }
  add_niveau(){
    const formData = this.formAdd.value;
    const niveau : Niveau ={
      nom: formData.nom
    }
    console.log(niveau, "nnivvv")
    // return
    if(this.formAdd.valid){
       this.setingService.addNiveau(formData).subscribe({
      next: (data) => {
        this.pageTitle.showSuccessToast(data.message)
        this.load_niveau();
        this.formAdd.reset()
        this.load_formAdd();
        this.show_add = false
        this.closeModal.emit()
      },
      error: (error) => {
        this.pageTitle.showErrorToast(error.error.message)
      }
      });
    }
   
  }

  // ---------------------update
  load_formUpdate(){
    this.formUpdate = this.fb.group({
      id: ['', Validators.required],
      nom: ['', [Validators.required, Validators.maxLength(40)]]
    })
  }
  update_niveau(){
    const formData = this.formUpdate.value;
    const niveau : Niveau ={
      id: formData.id,
      nom: formData.nom
    }
    console.log(niveau, "nnivvv")
    // return
    if(this.formUpdate.valid){
       this.setingService.updateNiveau(niveau).subscribe({
      next: (data) => {
        this.pageTitle.showSuccessToast(data.message)
        this.load_niveau();
        this.formUpdate.reset();
        this.load_formUpdate();
        this.ishow_update = false
        this.closeModal.emit()
      },
      error: (error) => {
        this.pageTitle.showErrorToast(error.error.message)
      }
      });
    }
  }
  // ------------------------delete
  
  delete_niveau(idSelect : number){
    this.setingService.deleteNiveau(idSelect).subscribe({
      next: (result) => {
        this.pageTitle.showSuccessToast(result.message)
        this.load_niveau();
        this.show_deleted = false
        this.isConfirm = false
        this.closeModal.emit()
      },
      error: (error) => {
        this.pageTitle.showErrorToast(error.error.message)
      }
     })
  }

  getNiveauType() : {key: string, value: string}[] {
    return Object.keys(NiveauEnum).map( key =>({
      key: key,
      value: NiveauEnum[key as keyof typeof NiveauEnum ]
    }))
  }

}

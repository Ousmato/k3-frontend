import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AnneeScolaire } from '../../Admin/Models/School-info';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../Services/icons.service';
import { SchoolService } from '../../Services/school.service';
import { PageTitleService } from '../../Services/page-title.service';

@Component({
  selector: 'app-promotion-widget',
  templateUrl: './promotion-widget.component.html',
  styleUrl: './promotion-widget.component.css'
})
export class PromotionWidgetComponent implements OnInit {

  @Output() closeModal = new EventEmitter<any>();
  form_annee!: FormGroup
  form_edit!: FormGroup
  annees: AnneeScolaire[] =[]
  is_show: boolean = false
  ishow_update: boolean = false
  ishow_add: boolean = false
  isConfirm: boolean = false
  ishow_delete: boolean = false
  isDelete: boolean = false
  anneForDelete!: AnneeScolaire


  constructor(private fb: FormBuilder, public icons: IconsService, 
    private infoSchool: SchoolService,
     private pageTile: PageTitleService){}

  ngOnInit(): void {
    this.load_form();
    this.get_annees();
    this.load_edit_form();
      
  }

  // --------------------load form 
  load_form(){
    this.form_annee = this.fb.group({
      debutAnnee: ['', Validators.required],
      finAnnee: ['', Validators.required]
    })
  }
  // ------------------load edit form
  load_edit_form(){
    this.form_edit = this.fb.group({
      id: [''],
      debutAnnee: ['', Validators.required],
      finAnnee: ['', Validators.required]
    })
  }
  submit(){
    const formData = this.form_annee.value
    const annee: AnneeScolaire = {
      debutAnnee: formData.debutAnnee,
      finAnnee: formData.finAnnee
    }
    console.log(annee, "promotion");
    // return
    if(this.form_annee.valid){
      this.infoSchool.addAnnee(annee).subscribe({
        next: (result) =>{
          this.pageTile.showSuccessToast(result.message);
          this.form_annee.reset();
          this.load_form();
          this.get_annees();
          this.ishow_add = false
          this.closeModal.emit();
        },
        error: (erreur) =>{
          this.pageTile.showErrorToast(erreur.error.message);
        }
      })
  }
}

  // -------------------------get annees
  get_annees(){
    this.infoSchool.getAll_annee().subscribe(data =>{
      this.annees = data;
      this.annees.forEach(ans=>{
        const annee = new Date(ans.debutAnnee)
        const debutAnnee = annee.getFullYear()
        ans.ans = debutAnnee
      })
    })
  }
  // -------------------------edit annee
  update_promotion(){
    const formData = this.form_edit.value
    const annee: AnneeScolaire = {
      id: formData.id,
      debutAnnee: formData.debutAnnee,
      finAnnee: formData.finAnnee
    }
    if(this.form_edit.valid){
      this.infoSchool.updateAnnee(annee).subscribe({
        next: (result) =>{
          this.pageTile.showSuccessToast(result.message);
          this.form_edit.reset();
          this.load_edit_form();
          this.get_annees();
          this.ishow_update = false
          this.closeModal.emit();
        },
        error: (erreur) =>{
          this.pageTile.showErrorToast(erreur.error.message);
        }
      })
    }
    
  }
  // ----------------------close edit modal
  close_update(){
    this.ishow_update =false
    this.closeModal.emit();
  }

  close_add(){
    this.ishow_add = false
    this.closeModal.emit();
  }
  exitDelete(){
    this.isConfirm = false;
    this.closeModal.emit();

  }
  annuler(){
    this.ishow_delete = false
    this.closeModal.emit();
  }
  // -------------------------delete method
  delete_classe(idAnnee : number){
    this.infoSchool.deleteAnnee(idAnnee).subscribe({
      next: (result) =>{
        this.pageTile.showSuccessToast(result.message);
        this.get_annees();
        this.isConfirm = false
      },
      error: (erreur) =>{
        this.pageTile.showErrorToast(erreur.error.message);
      }
    })
    
  }
  onChange(event: any){
    const idSelect = event.target.value;
    const anneeSelect = this.annees.find(an => an.id == idSelect);
    this.form_edit.get('debutAnnee')?.setValue(anneeSelect?.debutAnnee);
    this.form_edit.get('finAnnee')?.setValue(anneeSelect?.finAnnee);
    this.form_edit.get('id')?.setValue(anneeSelect?.id);
  }
  
  // -----------------------------on delete
  onDelete(event: any){
    const idSelect = event.target.value;
    this.anneForDelete = this.annees.find(an => an.id == idSelect)!
  }
  // ---------------------------------show forms 
  show_added(){
    this.ishow_add = true
    this.closeModal.emit();
  }
  show_updated(){
    this.ishow_update = true;
    this.closeModal.emit();
  }
  show_delete(){
    this.ishow_delete = true
    this.closeModal.emit();
  }
  // -------------------------------show delete confirmation
  nextToConfirm(){
    this.ishow_delete = false
    this.isConfirm = true;
    this.closeModal.emit();
  }
}

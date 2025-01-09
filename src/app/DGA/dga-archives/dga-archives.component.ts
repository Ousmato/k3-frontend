import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnneeScolaire } from '../../Admin/Models/School-info';
import { IconsService } from '../../Services/icons.service';
import { SchoolService } from '../../Services/school.service';
import { PageTitleService } from '../../Services/page-title.service';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { Admin } from '../../Admin/Models/Admin';
import { AdminUSER } from '../../Admin/Models/Auth';

@Component({
  selector: 'app-dga-archives',
  templateUrl: './dga-archives.component.html',
  styleUrl: './dga-archives.component.css'
})
export class DgaArchivesComponent  implements OnInit{

  form_annee!: FormGroup
  form_edit!: FormGroup
  annees: AnneeScolaire[] =[]
  is_show: boolean = false
  is_Edit: boolean = false
  overlay : boolean = false
  isDelete: boolean = false
  isSelected!: AnneeScolaire
  admin!: Admin


  constructor(private fb: FormBuilder, public icons: IconsService, private infoSchool: SchoolService, private pageTile: PageTitleService){}

  ngOnInit(): void {
    this.load_form();
    this.get_annees();
    this.load_edit_form();
    this.admin = AdminUSER()?.dga
      
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
    if(this.form_annee.valid){
      this.infoSchool.addAnnee(annee, this.admin.idAdministra!).subscribe({
        next: (result) =>{
          this.pageTile.showSuccessToast(result.message);
          this.load_form();
          this.get_annees();
          this.is_show = false
          this.overlay = false
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
  // --------------------------is how form
  add_annee(){
    this.is_show =!this.is_show
    this.overlay = true
 
  }
  show_edit(annee: AnneeScolaire){
      this.form_edit.get('debutAnnee')?.setValue(annee.debutAnnee);
      this.form_edit.get('finAnnee')?.setValue(annee.finAnnee);
      this.form_edit.get('id')?.setValue(annee.id);
      this.is_Edit = ! this.is_Edit
      this.overlay =! this.overlay
  }
  // -------------------------edit annee
  update(){
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
          this.load_form();
          this.get_annees();
         
          this.overlay = false
        },
        error: (erreur) =>{
          this.pageTile.showErrorToast(erreur.error.message);
        }
      })
    }
    
  }
  // ----------------------close edit modal
  close(){
    this.is_Edit = false
    this.overlay = false
    this.load_edit_form();
  }
  // -------------------------delete method
  delete_annee(annee: AnneeScolaire){
    // return
    this.isSelected  = annee
    this.isDelete =! this.isDelete
    this.overlay =! this.overlay
    
  }
  // ---------------------btn confirm
  confimed(){
      // if(i)
      console.log(this.isSelected, "id trouver")
    this.infoSchool.deleteAnnee(this.isSelected.id!).subscribe({
      next: (result) =>{
        this.pageTile.showSuccessToast(result.message);
       
        this.isDelete = false
        this.overlay =false 
        // this.get_annees();
        this.ngOnInit()
      },
      error: (erreur) =>{
        this.pageTile.showErrorToast(erreur.error.message);
      }
    })
  }
  // -----------------------annuler confirmed
  annuler(){
    this.isDelete = false
    this.overlay = false
    // this.isSelected = null
  }
}

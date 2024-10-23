import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Admin, Admin_role } from '../../Models/Admin';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../../Services/icons.service';
import { AdminService } from '../../../Services/admin.service';
import { PageTitleService } from '../../../Services/page-title.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.css'
})
export class AddAdminComponent implements OnInit{

  
  passwordVisible: boolean = false
  // show_add_form: boolean = true
  add_admin_form!: FormGroup
  fileName!: File
  @Output() closeModal = new EventEmitter<any>();

  adminStatusOptions:{ key: string, value: string }[] = [];

  constructor(public icons: IconsService, private fb: FormBuilder, private pageTitle: PageTitleService,
    private adminService: AdminService){}

  ngOnInit(): void {
      this.load_add_form();
  }

  // ------------------load form
  load_add_form(){
    this.add_admin_form = this.fb.group({
      // idEnseignant: ['', Validators.required],
      nom: ['', [Validators.required, Validators.maxLength(20)]],
      prenom: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', Validators.required],
      sexe: ['', Validators.required],
      password: ['', [
       
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}$/),
      ]],
      telephone: ['', Validators.required],
      role: ['', Validators.required]
    })
    // console.log("add-admin-form")
    this.adminStatusOptions = this.getStatusOptions();
   
  }

    togglePasswordVisibility(): void {
      this.passwordVisible = !this.passwordVisible;
  }

  onFileSelected(event: any)  {
    this.fileName = event.target.files[0];
  }

  
  getStatusOptions(): { key: string, value: string }[] {
    return Object.keys(Admin_role).map(key => ({
      key: key,
      value: Admin_role[key as keyof typeof Admin_role] 
    }));
  }
  // ------------------------------add admin
  add_admin(){
    const formData = this.add_admin_form.value;
    if(this.add_admin_form.valid){
      const admin: Admin ={
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        telephone: formData.telephone,
        sexe: formData.sexe,
        role: formData.role
      }
      console.log(admin, "admin")
      // return
      this.adminService.add_admin(admin, this.fileName).subscribe({
        next: (response)=>{
          this.pageTitle.showSuccessToast(response.message);
          this.add_admin_form.reset();
          this.closeModal.emit();
        },
        error: (erreur) =>{
          this.pageTitle.showErrorToast(erreur.error.message);
        }
      })
    }else{
      this.add_admin_form.markAllAsTouched();
    }
    // this.closeModal.emit();
  }

  // exit
  close_modal(){
    // this.overlay = false
    this.closeModal.emit();
  }
}

import { Component, OnInit } from '@angular/core';
import { Admin, Roles } from '../../Admin/Models/Admin';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../Services/admin.service';
import { AdminUSER } from '../../Admin/Models/Auth';
import { IconsService } from '../../Services/icons.service';
import { PageTitleService } from '../../Services/page-title.service';
import { SideBarService } from '../../sidebar/side-bar.service';
import { TypeFilieres } from '../../Admin/Models/Filieres';
import { of } from 'rxjs';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent  implements OnInit{

  showAdd: boolean = false;
  showupdate: boolean = false;
  index!: number;
  isConfirm: boolean = false;
  searchTerm: string = ''
  roles: Roles[] = []
  filteredItem: Roles[] = []
  addForm!: FormGroup
  updateForm!: FormGroup

  typeFilieresOption : {key: string, value: string}[] = []
  adminDG!: Admin

  constructor(private fb: FormBuilder, private pageTitle: PageTitleService, private sideBarService: SideBarService,
    private adminService: AdminService, public icons: IconsService){}

  ngOnInit(): void {
      this.adminDG = AdminUSER()?.admin
      this.typeFilieresOption = this.getTypeFilieresOptions();
      this.loadRoles();
      this.loadForm();
      this.load_update_form();

      this.sideBarService.currentSearchTerm.subscribe(term => {
        this.searchTerm = term;
        console.log(this.searchTerm, "search")
        this.filteredRoles()
      })

  }

  // load form add
  loadForm(){
    this.addForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(40), Validators.minLength(3)]],
      typeFiliere: ['', [Validators.required]]
    })
  }

  load_update_form(){
    this.updateForm = this.fb.group({
      id: ['', [Validators.required]],
      idAdminDg: ['', [Validators.required]],
      nom: ['', [Validators.required, Validators.maxLength(40), Validators.minLength(3)]],
      typeFiliere: ['', [Validators.required]]
      
    })
  }

  // load all roles
  loadRoles(){
    this.adminService.getAllRoles(this.adminDG.idAdministra!).subscribe(result =>{
      this.roles = result
      console.log(this.roles, "roles")
    })
  }
  // show add role
  show_form(){
    this.showAdd = true
  }

  // submit form
  addRole(){
    const formData = this.addForm.value;
    console.log(formData, "formData");
    if(this.addForm.valid){
      this.adminService.addRole(formData, this.adminDG.idAdministra!).subscribe({
        next: (res) =>{
          this.pageTitle.showSuccessToast(res.message);
          this.loadRoles();
          this.loadForm();
        },
        error: (erreur)=>{
          this.pageTitle.showErrorToast(erreur.error.message);
        }
      })
    }else{
      this.addForm.markAllAsTouched();
    }
    console.log(formData, "add role")

  }
  filteredRoles(){
    if(!this.searchTerm){
      return this.filteredItem = this.roles
    }
    return this.filteredItem = this.roles.filter(role => role.nom.toLowerCase().includes(this.searchTerm.toLowerCase()))
  }

  // confirmation delete role
  show_confirm(index: number){
    this.isConfirm = true;
   this.index = index
  }
  toEdit(role: Roles){
    this.showupdate = true;
    this.updateForm.get("nom")?.setValue(role.nom);
    // this.updateForm.get("typeFiliere")?.setValue(role.typeFiliere);
    this.updateForm.get("id")?.setValue(role.id);
    this.updateForm.get("idAdminDg")?.setValue(this.adminDG.idAdministra!)
    
  }

  update(){
    const formData = this.updateForm.value;
    console.log("formData", formData)
    const role : Roles ={
      id: formData.id,
      nom: formData.nom,
      idAdminDg: formData.idAdminDg,
      typeFiliere: formData.typeFiliere!
    }
    if(this.updateForm.valid){
      this.adminService.updateRole(role).subscribe({
        next: (res) =>{
          this.pageTitle.showSuccessToast(res.message);
          this.loadRoles();
          this.load_update_form();
          this.showupdate = false;
        },
        error: (erreur)=>{
          this.pageTitle.showErrorToast(erreur.error.message);
        }
      })
    }else{
      this.updateForm.markAllAsTouched();
    }
    console.log(formData, "update role")
  }

  exite(){
    this.showAdd = false
    this.showupdate = false
    this.isConfirm = false
  }

  deleted(idRole: number){
    this.adminService.deletedRole(idRole).subscribe({
      next: (res) =>{
        this.pageTitle.showSuccessToast(res.message);
        this.loadRoles();
        this.isConfirm = false
      },
      error: (erreur)=>{
        this.pageTitle.showErrorToast(erreur.error.message);
      }
    })
  }

  // abrevigate
  abrevigateName(name: string){
    const words = name.split(' ')
    return words.filter(words => words.length > 3).map(words => words[0].toUpperCase()).join('');
  }

  getTypeFilieresOptions(): {key: string, value: string}[]{
    return Object.keys(TypeFilieres).map(key => ({
      key : key ,
      value: TypeFilieres[key as keyof typeof TypeFilieres]}))

  }
}

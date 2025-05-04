import { Component, inject } from '@angular/core';
import { Admin, AdministrationUserPostes, RoleTypes } from '../../../administrations/shared/models/Admin';
import { FormGroup, Validators } from '@angular/forms';
import { contructor_dependencies } from '../../../administrations/dependencies/dependencies';
import { faculte, TypeFilieres } from '../../Models/Filieres';
import { Enumerateds } from '../../../administrations/shared/utils/enumerateds';
import { getUser } from '../../../administrations/shared/models/auth';

@Component({
  selector: 'app-poste-admin-users',
  templateUrl: './poste-admin-users.component.html',
  styleUrl: './poste-admin-users.component.css'
})
export class PosteAdminUsersComponent {


  showAdd: boolean = false;
  showupdate: boolean = false;
  index!: number;
  isConfirm: boolean = false;
  searchTerm: string = ''
  postes: AdministrationUserPostes[] = []
  filteredItem: AdministrationUserPostes[] = []
  addForm!: FormGroup
  updateForm!: FormGroup

  typeFilieresOption: { key: string, value: string }[] = []
  roleTypeOption: { key: string, value: string }[] = []
  faculteOption: { key: string, value: string }[] = []
  admin!: Admin

  public dependencies = inject(contructor_dependencies)

  ngOnInit(): void {
    this.loadForm();
    this.admin = getUser();
    this.loadRoles();
    this.typeFilieresOption = this.dependencies.enumerateds.getEnumeratedKeyValue(TypeFilieres);
    this.roleTypeOption = this.dependencies.enumerateds.getRoleTypeFilterOptions();
    this.roleTypeOption = this.dependencies.enumerateds.getRoleTypeFilterOptions();
    this.faculteOption = this.dependencies.enumerateds.getEnumeratedKeyValue(faculte);
    

    this.load_update_form();

  }

  // load form add
  loadForm() {
    const role = Enumerateds.getEnumKeyByValue(RoleTypes, RoleTypes.ADMIN)
    this.addForm = this.dependencies.fb.group({
      roleType: [role],
      faculte: [faculte.IUFP],
      nom: ['', [Validators.required, Validators.maxLength(40), Validators.minLength(3)]],
      typeFiliere: ['']
    })
  }

  load_update_form() {
    this.updateForm = this.dependencies.fb.group({
      id: ['', [Validators.required]],
      nom: ['', [Validators.required, Validators.maxLength(40), Validators.minLength(3)]],
      typeFiliere: ['', [Validators.required]]

    })
  }

  // load all roles
  loadRoles() {
    this.dependencies.adminService.getAllAdministrationUserPoste(this.admin.id!).subscribe(result => {
      this.postes = result
      this.filteredItem = this.postes
    })
  }
  // show add role
  show_form() {
    this.showAdd = true
  }

  // submit form
  addRole() {
    const formData = this.addForm.value;
    if (this.addForm.valid) {
      this.dependencies.adminService.addPoste(formData, this.admin.id!).subscribe({
        next: (res) => {
          this.dependencies.queryreturnMessage.showSuccessToast(res.message);
          this.loadRoles();
          this.loadForm();
        },
        error: (erreur) => {
          this.dependencies.queryreturnMessage.showErrorToast(erreur.error.message);
        }
      })
    } else {
      this.addForm.markAllAsTouched();
    }

  }
  

  // confirmation delete role
  show_confirm(index: number) {
    this.isConfirm = true;
    this.index = index
  }
  toEdit(poste: AdministrationUserPostes) {
    this.showupdate = true;
    this.updateForm.get("nom")?.setValue(poste.nom);
    // this.updateForm.get("typeFiliere")?.setValue(role.typeFiliere);
    this.updateForm.get("id")?.setValue(poste.id);

  }

  update() {
    const formData = this.updateForm.value;
    console.log("formData", formData)
    const role: AdministrationUserPostes = {
      id: formData.id,
      nom: formData.nom,
      roleType: formData.roleType,
      typeFiliere: formData.typeFiliere!
    }
    if (this.updateForm.valid) {
      this.dependencies.adminService.updatePoste(role).subscribe({
        next: (res) => {
          this.dependencies.queryreturnMessage.showSuccessToast(res.message);
          this.loadRoles();
          this.load_update_form();
          this.showupdate = false;
        },
        error: (erreur) => {
          this.dependencies.queryreturnMessage.showErrorToast(erreur.error.message);
        }
      })
    } else {
      this.updateForm.markAllAsTouched();
    }
    console.log(formData, "update role")
  }

  exite() {
    this.showAdd = false
    this.showupdate = false
    this.isConfirm = false
  }

  deleted(idRole: number) {
    this.dependencies.adminService.deletedRole(idRole).subscribe({
      next: (res) => {
        this.dependencies.queryreturnMessage.showSuccessToast(res.message);
        this.loadRoles();
        this.isConfirm = false
      },
      error: (erreur) => {
        this.dependencies.queryreturnMessage.showErrorToast(erreur.error.message);
      }
    })
  }


  onSearch(searchTerm: string) {    
  this.filteredItem = this.postes.filter(item =>
      item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.roleType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

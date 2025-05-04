import { Component, inject, OnInit } from '@angular/core';
import { usersGrade } from '../../../administrations/shared/models/userModel';
import { FormGroup, Validators } from '@angular/forms';
import { contructor_dependencies } from '../../../administrations/dependencies/dependencies';
import { Admin } from '../../../administrations/shared/models/Admin';
import { getUser } from '../../../administrations/shared/models/auth';

@Component({
  selector: 'app-user-grades',
  templateUrl: './user-grades.component.html',
  styleUrl: './user-grades.component.css'
})
export class UserGradesComponent  implements OnInit{

  
    showAdd: boolean = false;
    showupdate: boolean = false;
    index!: number;
    isConfirm: boolean = false;
    searchTerm: string = ''
    grades: usersGrade[] = []
    filteredGradesItem: usersGrade[] = []
    addForm!: FormGroup
    updateForm!: FormGroup
  
    typeFilieresOption: { key: string, value: string }[] = []
    roleTypeOption: { key: string, value: string }[] = []
    admin!: Admin
  
    public dependencies = inject(contructor_dependencies)
  
    ngOnInit(): void {
      this.loadForm();
      this.admin = getUser();
      this.loadGrades();
      
    }
  
    // load form add
    loadForm() {
      this.addForm = this.dependencies.fb.group({
        libelle: ['', [Validators.required]],
        heureDu: ['', [Validators.required, ]],
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
    loadGrades() {
      this.dependencies.adminService.getAllGrades(this.admin.id!).subscribe(result => {
        this.grades = result
        this.filteredGradesItem = this.grades
        console.log("les grade : ",this.filteredGradesItem)
      })
    }
    // show add role
    show_form() {
      this.showAdd = true
    }
  
    // submit form
    addGrade() {
      const formData = this.addForm.value;
      if (this.addForm.valid) {
        this.dependencies.adminService.addGrade(formData, this.admin.id!).subscribe({
          next: (res) => {
            this.dependencies.queryreturnMessage.showSuccessToast(res.message);
            this.loadGrades();
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
    toEdit(grade: usersGrade) {
      this.showupdate = true;
      this.updateForm.get("libelle")?.setValue(grade.libelle);
      this.updateForm.get("heureDu")?.setValue(grade.heureDu);
      this.updateForm.get("id")?.setValue(grade.id);
  
    }
  
    update() {
      const formData = this.updateForm.value;
      console.log("formData", formData)
      const grade: usersGrade = {
        id: formData.id,
        libelle: formData.libelle,
        heureDu: formData.heureDu!
      }
      if (this.updateForm.valid) {
        this.dependencies.adminService.updateGrade(grade).subscribe({
          next: (res) => {
            this.dependencies.queryreturnMessage.showSuccessToast(res.message);
            this.loadGrades();
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
      this.addForm.reset()
      this.updateForm.reset()
    }
  
    deleted(idRole: number) {
      this.dependencies.adminService.deletedRole(idRole).subscribe({
        next: (res) => {
          this.dependencies.queryreturnMessage.showSuccessToast(res.message);
          this.loadGrades();
          this.isConfirm = false
        },
        error: (erreur) => {
          this.dependencies.queryreturnMessage.showErrorToast(erreur.error.message);
        }
      })
    }
  
    onSearch(searchTerm: string) {    
    this.filteredGradesItem = this.grades.filter(item =>
        item.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.heureDu.toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

}

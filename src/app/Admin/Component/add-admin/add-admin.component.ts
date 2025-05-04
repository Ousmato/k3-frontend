import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Admin, Admin_role, AdministrationUserPostes, Roles, RoleTypes } from '../../../administrations/shared/models/Admin';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { contructor_dependencies } from '../../../administrations/dependencies/dependencies';
import { usersGrade } from '../../../administrations/shared/models/userModel';
import { Enumerateds } from '../../../administrations/shared/utils/enumerateds';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.css'
})
export class AddAdminComponent implements OnInit {

  postes: AdministrationUserPostes[] = [];
  grades: usersGrade[] = [];
  passwordVisible: boolean = false
  // show_add_form: boolean = true
  add_admin_form!: FormGroup
  @Input() idAdmin !: number
  currentStep = 1;
  totalSteps = 2;
  fileName!: File
  @Output() closeModal = new EventEmitter<any>();

  adminStatusOptions: { key: string, value: string }[] = [];

  public dependencies = inject(contructor_dependencies)

  ngOnInit(): void {
    this.load_add_form();
    this.getRoles();
    this.getAllGrades();
  }

  // ------------------load form
  load_add_form() {
    this.add_admin_form = this.dependencies.fb.group({
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
      idPoste: ['', Validators.required],
      nomBanque: [''],
      compteBanque: [''],
      matricule: ['', Validators.required],
      usersGrade: [''],
    })

  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onFileSelected(event: any) {
    this.fileName = event.target.files[0];
  }

  // load all roles
  getRoles() {
    this.dependencies.adminService.getAllAdministrationUserPoste(this.idAdmin).subscribe(result => {
     const role = Enumerateds.getEnumKeyByValue(RoleTypes, RoleTypes.SUPER_ADMIN)
     const resFilter =  result.filter(rf =>rf.roleType.toString() !== role)
      // const {postFilter}
      this.postes = resFilter;
      // console.log(this.postes, "roles")
    })
  }

  // load all grades
  getAllGrades() {
    this.dependencies.adminService.getAllGrades(this.idAdmin).subscribe(result => {
      const gradeFilter = result.filter(grade =>
        grade.libelle.toLowerCase().includes('avec poste'))
      this.grades = gradeFilter;
      console.log(this.grades, "grades")
    })
  }

  // ------------------------------add admin
  add_admin() {
    const formData = this.add_admin_form.value;
    const poste = this.postes.find(r => r.id == formData.idPoste);
    const grade = this.grades.find(gr =>gr.id == formData.usersGrade)
    if (this.add_admin_form.valid) {
      const admin: Admin = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        telephone: formData.telephone,
        sexe: formData.sexe,
        idPoste: poste!,
        usersGrade : grade,
        nomBanque: formData.nomBanque,
        compteBanque : formData.compteBanque,
        matricule: formData.matricule,
        

      }
      console.log(admin, "admin")
      // return
      this.dependencies.adminService.add_admin(admin, this.fileName).subscribe({
        next: (response) => {
          this.dependencies.queryreturnMessage.showSuccessToast(response.message);
          this.add_admin_form.reset();
          this.closeModal.emit();
        },
        error: (erreur) => {
          this.dependencies.queryreturnMessage.showErrorToast(erreur.error.message);
        }
      })
    } else {
      this.add_admin_form.markAllAsTouched();
    }
    // this.closeModal.emit();
  }

  // exit
  close_modal() {
    // this.overlay = false
    this.add_admin_form.reset();
    this.closeModal.emit();
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }
  
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}

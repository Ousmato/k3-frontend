import { Component,inject, OnInit} from '@angular/core';

import { Admin, AdminDto, AdministrationUserPostes, RoleTypes } from '../../administrations/shared/models/Admin';
import { FormGroup, Validators } from '@angular/forms';
import { NavigationExtras } from '@angular/router';
import { environment } from '../../../environments/environment';
import { contructor_dependencies } from '../../administrations/dependencies/dependencies';
import { Enumerateds } from '../../administrations/shared/utils/enumerateds';
import { usersGrade } from '../../administrations/shared/models/userModel';
import { getUser } from '../../administrations/shared/models/auth';

@Component({
  selector: 'app-my-accunt',
  templateUrl: './my-accunt.component.html',
  styleUrl: './my-accunt.component.css'
})
export class MyAccuntComponent implements OnInit {
  admin!: Admin
  update_form!: FormGroup
  adminStatusOptions: { key: string, value: string }[] = []
  passwordVisible: boolean = false
  isEdit: boolean = false
  permission: boolean = false
  fileName!: File
  urlImage!: string | ArrayBuffer | null
  photoSelect!: File
  idAdmin!: number
  superAdmin : Admin = getUser()
  postes: AdministrationUserPostes[] = []
  grades: usersGrade[] = []

  urlAsset = environment.urlAssetsImage

  public dependencies = inject(contructor_dependencies)



  ngOnInit(): void {
    this.load_admin()
    this.load_add_form();
    this.getPoste()
    this.loadGrades()
  }

  load_admin() {
    this.dependencies.root.queryParams.subscribe(param => {
      this.idAdmin = param['id'];
      this.dependencies.adminService.getAdminById(this.idAdmin).subscribe(admin => {
        console.log(admin, "aaaa")
        this.admin = admin
        this.admin.urlPhoto = `${environment.urlPhoto}${admin.urlPhoto}`
        this.update_form.get('nom')?.setValue(admin.nom);
        this.update_form.get('prenom')?.setValue(admin.prenom);
        this.update_form.get('email')?.setValue(admin.email);
        this.update_form.get('telephone')?.setValue(admin.telephone);
        this.update_form.get('sexe')?.setValue(admin.sexe);
        // this.update_form.get('idPoste')?.setValue(admin.idPoste.nom);
        this.update_form.get('nomBanque')?.setValue(admin.nomBanque);
        this.update_form.get('compteBanque')?.setValue(admin.compteBanque);
        this.update_form.get('matricule')?.setValue(admin.matricule);
        // this.update_form.get('usersGrade')?.setValue(admin.usersGrade?.libelle);
        if (this.superAdmin.idPoste.roleType.toString() !== Enumerateds.getEnumKeyByValue(RoleTypes, RoleTypes.SUPER_ADMIN)) {
         
          this.update_form.disable();

        }else{
          this.permission = true
          this.update_form.enable()
        }

      })
    })

  }

  //onErro
  onError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = `${this.urlAsset}business-professional-icon.svg`;
  }

  //show edit
  show_edit() {
    const elements = document.querySelectorAll('.input-control');
    const bordeNone = document.querySelectorAll('.input');

    // Parcourt chaque élément et applique un style de bordure
    elements.forEach((element) => {
      (element as HTMLElement).style.border = "1px solid gray";
      (element as HTMLElement).style.borderRadius = "5px";
      (element as HTMLElement).style.padding = "5px";
      (element as HTMLElement).style.outline = "none";
      (element as HTMLElement).style.width = "100%";
    });
    bordeNone.forEach((elements) => {
      (elements as HTMLElement).style.borderBottom = "none"
    })
    this.isEdit = true
  }


  load_add_form() {
    this.update_form = this.dependencies.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(20)]],
      prenom: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', Validators.required],
      sexe: ['', Validators.required],
      telephone: ['', Validators.required],

      idPoste : ['', Validators.required],
      nomBanque: [''],
      compteBanque: [''],
      matricule: [''],
      usersGrade: [''],


    })

  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
  // add admin
  update() {
    const formData = this.update_form.value;
    const idPoste = this.postes.find(poste => poste.id == formData.idPoste)
    console.log(idPoste, "id poste")
    const idGrade = this.grades.find(grade => grade.id == formData.usersGrade)
    console.log(idGrade, "id grade")
    if (this.update_form.valid) {
      const admin: Admin = {
        id: this.idAdmin,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        sexe: formData.sexe,
        idPoste: idPoste!,
        nomBanque: formData.nomBanque,
        compteBanque: formData.compteBanque,
        matricule: formData.matricule,
        usersGrade: idGrade,
      }

      console.log(admin, "admin")
      // return
      this.dependencies.adminService.updateAdmin(admin).subscribe({
        next: (response) => {
          this.dependencies.queryreturnMessage.showSuccessToast(response.message);
          this.update_form.reset();
          this.load_add_form();
          this.isEdit = false;
          this.load_admin();
          // this.eventService.emitEvent(response)
        },
        error: (erreur) => {
          this.dependencies.queryreturnMessage.showErrorToast(erreur.error.message);
        }
      })
    } else {
      this.update_form.markAllAsTouched();
      console.log("invalid", this.update_form.value);
    }
    // this.closeModal.emit();
  }

  //change password
  changePass(idAdmin: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: idAdmin
      }
    }
    this.dependencies.router.navigate(['/sidebar/change-password'], navigationExtras)
  }

  annuler() {
    this.isEdit = false;
    this.update_form.reset();
    this.load_add_form();
    this.load_admin();
    // this.close_edit();
  }
  // 
  // ----------------------select file

  onPhotoSelected(event: any) {

    this.photoSelect = event.target.files[0];
    if (this.photoSelect) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.urlImage = e.target.result; // Stocker l'URL de l'image
      };
      reader.readAsDataURL(this.photoSelect);
    }

  }
  //send image
  sendImage() {
    if (this.urlImage) {
      console.log(this.photoSelect, "la photo selectionner")
      // return
      this.dependencies.adminService.changeProfilImage(this.idAdmin, this.photoSelect).subscribe({
        next: (response) => {
          this.dependencies.queryreturnMessage.showSuccessToast("Mises à jour effectué avec succès");
          // this.dependencies..emitEvent(response)
          this.urlImage = null
          this.load_admin();
        },
        error: (erreur) => {
          this.dependencies.queryreturnMessage.showErrorToast(erreur.error.message);
        }
      })
    }
  }

   // load all roles
   getPoste() {
    this.dependencies.adminService.getAllAdministrationUserPoste(this.superAdmin.id!).subscribe(result => {
     const role = Enumerateds.getEnumKeyByValue(RoleTypes, RoleTypes.SUPER_ADMIN)
     const resFilter =  result.filter(rf =>rf.roleType.toString() !== role)
      // const {postFilter}
      this.postes = resFilter;
      console.log(this.postes, "roles")
    })
  }

   // load all roles
   loadGrades() {
    this.dependencies.adminService.getAllGrades(this.superAdmin.id!).subscribe(result => {
      const gradeFilter = result.filter(grade =>
        grade.libelle.toLowerCase().includes('avec poste'))
      this.grades = gradeFilter
      console.log("les grade : ",this.postes)
    })
  }

}

import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IconsService } from '../../Services/icons.service';
import { AdminService } from '../../Services/admin.service';
import { Admin, Admin_role, AdminDto } from '../../Admin/Models/Admin';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTitleService } from '../../Services/page-title.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { EventServiceService } from '../../Services/event-service.service';
import { environment } from '../../../environments/environment';
import { AdminUSER } from '../../Admin/Models/Auth';

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



  constructor(public icons: IconsService, private router: Router, private root: ActivatedRoute, private eventService: EventServiceService,
    private adminService: AdminService, private fb: FormBuilder, private pageTitle: PageTitleService) { }
  ngOnInit(): void {
    this.load_admin()
    this.load_add_form();
  }

  load_admin() {
    this.root.queryParams.subscribe(param => {
      const idAdmin = param['id']
      this.idAdmin = idAdmin
      this.adminService.getAdminById(idAdmin).subscribe(admin => {
        console.log(admin, "aaaa")
        this.admin = admin
        this.admin.urlPhoto = `${environment.urlPhoto}${admin.urlPhoto}`
      
        // this.admin.urlPhoto = `${environment.apiUrl}StudentImg/${this.admin.urlPhoto}`

        this.update_form.get('nom')?.setValue(admin.nom);
        this.update_form.get('prenom')?.setValue(admin.prenom);
        this.update_form.get('email')?.setValue(admin.email);
        this.update_form.get('telephone')?.setValue(admin.telephone);
        this.update_form.get('sexe')?.setValue(admin.sexe);
        if (AdminUSER()?.dg) {
          this.permission = true
        }

      })


    })

  }

  // ------------onErro
  onError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/business-professional-icon.svg';
  }

  // -----------------show edit
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
    this.update_form = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(20)]],
      prenom: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', Validators.required],
      sexe: ['', Validators.required],
      telephone: ['', Validators.required],

    })
    this.adminStatusOptions = this.getStatusOptions();

  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }



  getStatusOptions(): { key: string, value: string }[] {
    return Object.keys(Admin_role).map(key => ({
      key: key,
      value: Admin_role[key as keyof typeof Admin_role]
    }));
  }
  // ------------------------------add admin
  update() {
    const formData = this.update_form.value;
    if (this.update_form.valid) {
      const admin: AdminDto = {
        idAdministra: this.idAdmin,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
      }

      console.log(admin, "admin")
      // return
      this.adminService.updateAdmin(admin).subscribe({
        next: (response) => {
          this.pageTitle.showSuccessToast("Mises à jour éffectué avec succès");
          this.update_form.reset();
          this.load_add_form();
          this.isEdit = false;
          this.load_admin();
          this.eventService.emitEvent(response)
        },
        error: (erreur) => {
          this.pageTitle.showErrorToast(erreur.error.message);
        }
      })
    } else {
      this.update_form.markAllAsTouched();
      console.log("invalid", this.update_form.value);
    }
    // this.closeModal.emit();
  }

  // --------------------change password
  changePass(idAdmin: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: idAdmin
      }
    }
    this.router.navigate(['/sidebar/change-password'], navigationExtras)
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
  // --------------send image
  sendImage() {
    if (this.urlImage) {
      console.log(this.photoSelect, "la photo selectionner")
      // return
      this.adminService.changeProfilImage(this.idAdmin, this.photoSelect).subscribe({
        next: (response) => {
          this.pageTitle.showSuccessToast("Mises à jour effectué avec succès");
          this.eventService.emitEvent(response)
          this.urlImage = null
          this.load_admin();
        },
        error: (erreur) => {
          this.pageTitle.showErrorToast(erreur.error.message);
        }
      })
    }
  }


}

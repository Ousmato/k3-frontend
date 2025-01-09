import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { Admin, adminEtat, AdminRoleDto, Roles } from '../../Admin/Models/Admin';
import { SideBarService } from '../../sidebar/side-bar.service';
import { IconsService } from '../../Services/icons.service';
import { PageTitleService } from '../../Services/page-title.service';
import { Router } from '@angular/router';
import { getActionCache } from '@angular/core/primitives/event-dispatch';
import { environment } from '../../../environments/environment';
import { AdminUSER } from '../../Admin/Models/Auth';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css'
})
export class AdminListComponent implements OnInit {

  admin_etats: { key: string; value: number }[] = []
  // admins: Admin[] = []
  adminsDto: AdminRoleDto[] = []
  searchTerm: string = ""
  adminFiltered: AdminRoleDto[] = []
  roles: Roles[] = []
  index!: number
  idRoleSelect!: Roles
  dg!: Admin
  show_add_form: boolean = false
  isAfectPoste: boolean = false
  isConfirm: boolean = false
  isAddPostConfirm: boolean = false
  overlay: boolean = false

  constructor(private adminService: AdminService, public icons: IconsService, private router: Router,
    private pageTitle: PageTitleService,
    private sideBareService: SideBarService) { }

  ngOnInit(): void {
    this.getAllAdminActif();
    this.admin_etats = this.getAdminEtat();

    this.dg = AdminUSER()?.admin
    this.getAllRoles();
    this.sideBareService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filteredAdmins();

    });
  }

  // load all admin
  getAllAdminActif() {
    this.adminService.getAllAdminActifs().subscribe(admins => {
     this.formatedData(admins)
    this.adminFiltered = this.adminsDto

    })
  }
  // get all roles
  getAllRoles() {
    this.adminService.getAllRoles(this.dg.idAdministra!).subscribe(roles => {
      this.roles = roles;
      console.log(this.roles, "roles")
    })
  }

  // ------------onErro
  onError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/business-professional-icon.svg';
  }
  // ----------------get admin etats
  getAdminEtat(): { key: string, value: number }[] {
    return Object.keys(adminEtat)
    .filter(key => isNaN(Number(key))) // Filtrer pour obtenir seulement les clés
    .map(key => ({
        key: key, // La clé (nom de l'état)
        value: adminEtat[key as keyof typeof adminEtat] // La valeur correspondante
    }));
  }
  // ---------------
  getEtat(event: any) {
    const value = event.target.value
    this.adminService.getAllByEtat(value).subscribe(adm =>{
     this.formatedData(adm);
    this.adminFiltered = this.adminsDto
    })
  }
  show_form() {
    this.show_add_form = true;
    this.overlay = true
  }

  close() {
    this.show_add_form = false
    this.overlay = false
    this.getAllAdminActif();
  }

  // ----filter
  filteredAdmins() {
    if (!this.searchTerm) {
      return this.adminFiltered = this.adminsDto
    }
    return this.adminFiltered = this.adminsDto.filter(ad => ad.admin.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      ad.admin.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) || ad.admin.idRole.nom.includes(this.searchTerm.toLowerCase())
    )
  }
  // ---------------change etat
  changeEtat(idAdmin: number){
    this.adminService.changeEtat(idAdmin).subscribe({
      next: (result) => {
        this.pageTitle.showSuccessToast(result.message)
        this.getAllAdminActif();
        this.overlay = false
        this.isConfirm = false
        this.getAdminEtat();
      },
      error: (error) => {
        this.pageTitle.showErrorToast(error.error.message)
      }
      
    })
  }

  // on select role change
  onRoleChange(event: any) {
    const id = Number(event.target.value);
    
    this.idRoleSelect = this.roles.find(r => r.id === id)!
    console.log(this.idRoleSelect, "role change")
  }
  // post afectation
  postAffectation(idAdmin: number,  i: number) {
    this.index = i;
    this.isAfectPoste = true
    // this.adminService.postAffectation(idAdmin, idRole).subscribe({})
  }
  next(i: number ){
    this.index = i
    this.isAddPostConfirm = true

  }
  // -----------------go to edit component
  toEdit(idAdmin: number){
    this.router.navigate(['/sidebar/my-accunt'], {queryParams: {id: idAdmin}})
  }

  show_confirm(i: number){
    this.index = i;
    this.isConfirm = true;
    this.overlay = true;
    console.log("is confirm :", this.isConfirm)
  }
  exite(){
    this.isConfirm = false;
    this.overlay = false
  }

  formatedData(admins: AdminRoleDto[]){
    this.adminsDto = admins
    admins.forEach(ad => {
      ad.admin.urlPhoto = `${environment.urlPhoto}${ad.admin.urlPhoto}`

      ad.admin.nom = ad.admin.nom.charAt(0).toUpperCase() + ad.admin.nom.slice(1).toLowerCase(); // Majuscule pour le nom
      ad.admin.prenom = ad.admin.prenom.charAt(0).toUpperCase() + ad.admin.prenom.slice(1).toLowerCase();
    })
  }

  // abrevigate name
  abrevigateName(name: string){
    const words = name.split(' ')
    return words.filter(words => words.length > 3).map(words => words[0].toUpperCase()).join('');
  }

  submit(idAdminDefault: number, idRole: number){
    // console.log(idAdminDefault, "admin", idRole, "role");
    // return
    this.adminService.postAfectation(idAdminDefault, idRole).subscribe({
      next: (res) => {
        this.pageTitle.showSuccessToast(res.message)
        this.getAllAdminActif();
        this.isAddPostConfirm = false
        this.isAfectPoste = false
      },
      error: (err) => {
        this.pageTitle.showErrorToast(err.error.message);
      }
    })

  }
}

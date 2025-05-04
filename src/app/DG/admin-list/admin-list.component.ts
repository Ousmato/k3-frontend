import { Component, inject, OnInit } from '@angular/core';
import { Admin, adminEtat, AdministrationUserPostes, AdminRoleDto, Poste, Roles, RoleTypes } from '../../administrations/shared/models/Admin';
import { environment } from '../../../environments/environment';
import { contructor_dependencies } from '../../administrations/dependencies/dependencies';
import { Enumerateds } from '../../administrations/shared/utils/enumerateds';
import { getUser } from '../../administrations/shared/models/auth';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css'
})
export class AdminListComponent implements OnInit {
  urlAsset = environment.urlAssetsImage

  admin_etats: { key: string; value: number }[] = []
  // admins: Admin[] = []
  adminsDto: AdminRoleDto[] = []
  searchTerm: string = ""
  adminFiltered: AdminRoleDto[] = []
  postes: AdministrationUserPostes[] = []
  filteredPostesItems: AdministrationUserPostes[] = []
  index!: number
  idPosteSelect!: AdministrationUserPostes
  admin!: Admin
  adminPoste!: any
  show_add_form: boolean = false
  isAfectPoste: boolean = false
  isConfirm: boolean = false
  isAddPostConfirm: boolean = false
  overlay: boolean = false

  public dependencies = inject(contructor_dependencies)

  ngOnInit(): void {
    this.admin = getUser()
    this.adminPoste = Enumerateds.getEnumKeyByValue(RoleTypes, RoleTypes.SUPER_ADMIN)
    console.log(this.adminPoste, "le poste admin")
    this.getAllAdminActif();
    this.admin_etats = this.getAdminEtat();
  }

  // load all admin
  getAllAdminActif() {
    this.dependencies.adminService.getAllAdminActifs().subscribe(admins => {
     this.formatedData(admins)
    this.adminFiltered = this.adminsDto
    console.log(this.adminFiltered, "admins actifs")

    })
  }
 

  // ------------onErro
  onError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = `${this.urlAsset}business-professional-icon.svg`;
  }
  // // ----------------get admin etats
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
    this.dependencies.adminService.getAllByEtat(value).subscribe(adm =>{
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

  //change etat
  changeEtat(idAdmin: number){
    this.dependencies.adminService.changeEtat(idAdmin).subscribe({
      next: (result) => {
        this.dependencies.queryreturnMessage.showSuccessToast(result.message)
        this.getAllAdminActif();
        this.overlay = false
        this.isConfirm = false
      },
      error: (error) => {
        this.dependencies.queryreturnMessage.showErrorToast(error.error.message)
      }
      
    })
  }

  // on select role change
  onRoleChange(event: any) {
    const id = Number(event.target.value);
    
    this.idPosteSelect = this.postes.find(r => r.id === id)!
    console.log(this.idPosteSelect, "role change")
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
  //go to edit component
  toEdit(idAdmin: number){
    this.dependencies.router.navigate(['/sidebar/my-accunt'], {queryParams: {id: idAdmin}})
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


  submit(idAdminDefault: number, idRole: number){
    // console.log(idAdminDefault, "admin", idRole, "role");
    // return
    this.dependencies.adminService.postAfectation(idAdminDefault, idRole).subscribe({
      next: (res) => {
        this.dependencies.queryreturnMessage.showSuccessToast(res.message)
        this.getAllAdminActif();
        this.isAddPostConfirm = false
        this.isAfectPoste = false
      },
      error: (err) => {
        this.dependencies.queryreturnMessage.showErrorToast(err.error.message);
      }
    })

  }

  onSearch(searchTerm: string) {
    
    this.adminFiltered = this.adminsDto.filter(item =>
      item.admin.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.admin.prenom.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

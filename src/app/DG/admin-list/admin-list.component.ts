import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { Admin, adminEtat } from '../../Admin/Models/Admin';
import { SideBarService } from '../../sidebar/side-bar.service';
import { IconsService } from '../../Services/icons.service';
import { PageTitleService } from '../../Services/page-title.service';
import { Router } from '@angular/router';
import { getActionCache } from '@angular/core/primitives/event-dispatch';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css'
})
export class AdminListComponent implements OnInit {

  admin_etats: { key: string; value: number }[] = []
  admins: Admin[] = []
  searchTerm: string = ""
  adminFiltered: Admin[] = []
  index!: number
  show_add_form: boolean = false
  isConfirm: boolean = false
  overlay: boolean = false

  constructor(private adminService: AdminService, public icons: IconsService, private router: Router,
    private pageTitle: PageTitleService,
    private sideBareService: SideBarService) { }

  ngOnInit(): void {
    this.getAllAdminActif();
    this.admin_etats = this.getAdminEtat();
    this.sideBareService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filteredAdmins();

    });
  }

  // load all admin
  getAllAdminActif() {
    this.adminService.getAllAdminActifs().subscribe(admins => {
      this.admins = admins;
      console.log(admins, "liste admin")
      admins.forEach(ad => {
        ad.urlPhoto = `http://localhost/StudentImg/${ad.urlPhoto}`
        ad.nom = ad.nom.charAt(0).toUpperCase() + ad.nom.slice(1).toLowerCase(); // Majuscule pour le nom
        ad.prenom = ad.prenom.charAt(0).toUpperCase() + ad.prenom.slice(1).toLowerCase();
      })
    this.adminFiltered = this.admins

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
      this.admins = adm
      adm.forEach(ad => {
        ad.urlPhoto = `http://localhost/StudentImg/${ad.urlPhoto}`
        ad.nom = ad.nom.charAt(0).toUpperCase() + ad.nom.slice(1).toLowerCase(); // Majuscule pour le nom
        ad.prenom = ad.prenom.charAt(0).toUpperCase() + ad.prenom.slice(1).toLowerCase();
      })
    this.adminFiltered = this.admins
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
      return this.adminFiltered = this.admins
    }
    return this.adminFiltered = this.admins.filter(ad => ad.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      ad.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) || ad.role.includes(this.searchTerm.toLowerCase())
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

}

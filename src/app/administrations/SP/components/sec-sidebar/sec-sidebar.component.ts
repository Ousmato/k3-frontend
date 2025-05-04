import { Component, inject, OnInit } from '@angular/core';
import { Admin } from '../../../shared/models/Admin';
import { environment } from '../../../../../environments/environment';
import { contructor_dependencies } from '../../../dependencies/dependencies';
import { getUser } from '../../../shared/models/auth';

@Component({
  selector: 'app-sec-sidebar',
  templateUrl: './sec-sidebar.component.html',
  styleUrl: './sec-sidebar.component.css'
})
export class SecSidebarComponent implements OnInit {

  isConfirm: boolean = false

  dataAdmin!: Admin
  urlAsset = `${environment.urlAssetsImage}`

  sidbare: any
  public dependencies = inject(contructor_dependencies)
  ngOnInit(): void {
    this.sidbare = document.getElementById('sidebar');

    this.dataAdmin = getUser()
    this.dataAdmin.urlPhoto = `${environment.urlPhoto}${this.dataAdmin.urlPhoto}`

  }

  //shearch 

  onError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/business-professional-icon.svg';
  }
  show_confirm() {
    this.isConfirm = true

  }
  close() {
    this.isConfirm = false;
  }

  toAccunt() {
    this.dependencies.router.navigate(['/secretaire/my-accunt'], { queryParams: { id: this.dataAdmin.id } })
  }
  // ---------------
  singAout() {
    sessionStorage.clear();
    this.dependencies.router.navigate(['']);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Admin } from '../Admin/Models/Admin';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {
  private readonly storageKey = 'sb|sidebar-toggle';

  private adminSubject = new BehaviorSubject<any>(null);

  private searchTerm = new BehaviorSubject<string>('');
  currentSearchTerm = this.searchTerm.asObservable();

  changeSearchTerm(term: string) {
    console.log('Search term changed:', term);
    this.searchTerm.next(term);
  }

  setAdmin(admin: any) {
    console.log(admin, "admin envoyé au service sidebar");

    // Stockage dans BehaviorSubject
    this.adminSubject.next(admin);
    
    // Stockage dans la sessionStorage
    sessionStorage.setItem('admin', JSON.stringify(admin));
    
    // Vérifier si l'objet est bien stocké immédiatement après
    const storedAdmin = sessionStorage.getItem('admin');
    
    if (storedAdmin) {
        console.log(JSON.parse(storedAdmin), "admin récupéré avec succès de la sessionStorage");
    } else {
        console.error("Erreur : admin non stocké dans la sessionStorage");
    }
}

  getAdmin(): Observable<any> {
    const admin = sessionStorage.getItem('admin');
    if (admin) {
      this.adminSubject.next(JSON.parse(admin));
    }
    return this.adminSubject.asObservable();
  }
}

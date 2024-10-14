import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin, AdminDto } from '../Admin/Models/Admin';
import { Observable } from 'rxjs';
import { Response_String } from '../Admin/Models/Response_String';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = `${environment.apiUrl}api-admin/`
  constructor(private http: HttpClient) { }

  add_admin(admin: Admin, file: File) : Observable<Response_String>{
    const formData = new FormData();
    formData.append('admin', JSON.stringify(admin).toLowerCase());
    formData.append('file', file);
    return this.http.post<Response_String>(this.baseUrl+"add", formData);

  }

  // ---------------get all admin
  getAllAdminActifs() : Observable<Admin[]>{
    return this.http.get<Admin[]>(`${this.baseUrl}administrateurs-actifs`);
  }

  // ---------------get all by etAT
  getAllByEtat(value: number) : Observable<Admin[]>{
    return this.http.get<Admin[]>(`${this.baseUrl}administrateurs/${value}`);
  }
  changeEtat(value: number) : Observable<Response_String>{
    return this.http.get<Response_String>(`${this.baseUrl}change-etat/${value}`);
  }

  // ----------------getById
  getAdminById(idAdmin: number) : Observable<Admin>{
    return this.http.get<Admin>(`${this.baseUrl}administrateur/${idAdmin}`);
  }
  // ---------change profil image
  changeProfilImage(idAdmin: number, file: File) : Observable<Admin>{
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put<Admin>(`${this.baseUrl}change-photo/${idAdmin}`, formData);
  }
  // --------------------update
  updateAdmin(admin: AdminDto) : Observable<Admin>{
    return this.http.put<Admin>(`${this.baseUrl}update-admin`, admin);
  }
}

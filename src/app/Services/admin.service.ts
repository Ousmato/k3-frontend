import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin, AdminDto, AdminRoleDto, Roles } from '../Admin/Models/Admin';
import { finalize, Observable } from 'rxjs';
import { Response_String } from '../Admin/Models/Response_String';
import { environment } from '../../environments/environment';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = `${environment.apiUrl}api-admin/`
  constructor(private http: HttpClient, private loadService: LoaderService) { }

  add_admin(admin: Admin, file: File) : Observable<Response_String>{
    this.loadService.loading();
    const formData = new FormData();
    formData.append('admin', JSON.stringify(admin));
    formData.append('file', file);
    return this.http.post<Response_String>(this.baseUrl+"add", formData).pipe(
      finalize(() => this.loadService.stopLoading())
    );

  }

  // ---------------get all admin
  getAllAdminActifs() : Observable<AdminRoleDto[]>{
    return this.http.get<AdminRoleDto[]>(`${this.baseUrl}administrateurs-actifs`);
  }

  // ---------------get all by etAT
  getAllByEtat(value: number) : Observable<AdminRoleDto[]>{
    return this.http.get<AdminRoleDto[]>(`${this.baseUrl}administrateurs/${value}`);
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

  forgotPassword(email: any) : Observable<any[]>{
    return this.http.post<any[]>(`${this.baseUrl}forgot-password`, email);
  }

  // ------------------validate token
  validateToken(token: string): Observable<boolean>{
    console.log("token", token)
    const body = { token };
    return this.http.post<boolean>(`${this.baseUrl}validate-token`, body, {withCredentials:true});
  }

  //set new password
  setNewPassword(newPasse: number): Observable<boolean>{
    return this.http.post<boolean>(`${this.baseUrl}set-new-password`, newPasse);
  }

  // get all roles
  getAllRoles(idAdmin: number): Observable<Roles[]>{
    return this.http.get<Roles[]>(`${this.baseUrl}List-roles/${idAdmin}`);
  }

  // add role
  addRole(role: string, idAdmin: number): Observable<Response_String>{
    return this.http.post<Response_String>(`${this.baseUrl}add-role/${idAdmin}`, role);
  }

  // update role
  updateRole(role: Roles): Observable<Response_String>{
    return this.http.put<Response_String>(`${this.baseUrl}update-role`, role);
  }

  // delete role
  deletedRole(idRole: number): Observable<Response_String>{
    return this.http.delete<Response_String>(`${this.baseUrl}deleted-role/${idRole}`);
  }
  
  // affect post in admin
  postAfectation(idCurrentAdmin: number, idRole: number): Observable<Response_String>{
    return this.http.get<Response_String>(`${this.baseUrl}add-poste/${idCurrentAdmin}/${idRole}`)
  }

  // get all postes associated with the current user
  getPostesByIdCurrentAdmin(idCurrentAdmin: number): Observable<AdminRoleDto[]>{
    return this.http.get<AdminRoleDto[]>(`${this.baseUrl}get-roles-of-post-by-idAdmin/${idCurrentAdmin}`)
  }
}

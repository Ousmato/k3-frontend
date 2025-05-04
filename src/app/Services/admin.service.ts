import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin, AdminDto, AdministrationUserPostes, AdminRoleDto, Roles } from '../administrations/shared/models/Admin';
import { finalize, Observable } from 'rxjs';
import { Response_String } from '../Admin/Models/Response_String';
import { environment } from '../../environments/environment';
import { LoaderService } from './loader.service';
import { httpResponse } from '../administrations/shared/models/httpResponse.model';
import { usersGrade } from '../administrations/shared/models/userModel';

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
  updateAdmin(admin: Admin) : Observable<httpResponse>{
    return this.http.put<httpResponse>(`${this.baseUrl}update-admin`, admin);
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

  getAllAdministrationUserPoste(idAdmin: number): Observable<AdministrationUserPostes[]>{
    return this.http.get<AdministrationUserPostes[]>(`${this.baseUrl}List-roles/${idAdmin}`);
  }

  // add role
  addPoste(role: AdministrationUserPostes, idAdmin: number): Observable<httpResponse>{
    return this.http.post<httpResponse>(`${this.baseUrl}add-poste/${idAdmin}`, role);
  }

  // update role
  updatePoste(poste: AdministrationUserPostes): Observable<httpResponse>{
    return this.http.put<httpResponse>(`${this.baseUrl}update-role`, poste);
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

  // get all grades 
  getAllGrades(idAdmin: number): Observable<usersGrade[]>{
    return this.http.get<usersGrade[]>(`${this.baseUrl}get-all-grades/${idAdmin}`);
  }

  // add grade
  addGrade(grade: usersGrade, idAdmin: number): Observable<httpResponse>{
    return this.http.post<httpResponse>(`${this.baseUrl}add-grade/${idAdmin}`, grade);
  }
  // update grade
  updateGrade(grade: usersGrade): Observable<httpResponse>{
    return this.http.put<httpResponse>(`${this.baseUrl}update-grade`, grade);
  }
}

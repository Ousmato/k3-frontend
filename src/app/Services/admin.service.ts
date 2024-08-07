import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from '../Admin/Models/Admin';
import { Observable } from 'rxjs';
import { Response_String } from '../Admin/Models/Response_String';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl ='http://localhost:8080/api-admin/'
  constructor(private http: HttpClient) { }

  add_admin(admin: Admin, file: File) : Observable<Response_String>{
    const formData = new FormData();
    formData.append('admin', JSON.stringify(admin).toLowerCase());
    formData.append('file', file);
    return this.http.post<Response_String>(this.baseUrl+"add", formData);

  }

  // ------------------------------get all liste admin
  getAll_admin() : Observable<Admin[]>{
    return this.http.get<Admin[]>(this.baseUrl+"list");
  }

}

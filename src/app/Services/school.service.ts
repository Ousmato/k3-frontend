import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SchoolInfo } from '../Admin/Models/School-info';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private baseUrl = 'http://localhost:8080/Auth/'; 

  constructor(private http: HttpClient) { }
  getSchools() :Observable<SchoolInfo>{
    return this.http.get<SchoolInfo>(this.baseUrl+"read-info-school");
  }

  updateSchools(school: SchoolInfo, file: File) : Observable<any>{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('InfoSchool', JSON.stringify(school));
    return this.http.put<any>(this.baseUrl+"update", formData);
  }
}

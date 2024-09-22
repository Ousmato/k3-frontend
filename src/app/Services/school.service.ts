import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnneeScolaire, SchoolInfo } from '../Admin/Models/School-info';
import { Response_String } from '../Admin/Models/Response_String';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private baseUrl = 'http://localhost:8080/Auth/'; 

  constructor(private http: HttpClient) { }
  getSchools() :Observable<SchoolInfo>{
    return this.http.get<SchoolInfo>(this.baseUrl+"read-info-school");
  }

  updateSchools(school: SchoolInfo, file: File) : Observable<Response_String>{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('InfoSchool', JSON.stringify(school));
    return this.http.put<Response_String>(this.baseUrl+"update", formData);
  }
  // -----------------------------add annee scolaire
  addAnnee(annee: AnneeScolaire) : Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl+"add-annee-scolaire", annee);
  }
  // -------------------------------get all annee scolaire
  getAll_annee() : Observable<AnneeScolaire[]>{
    return this.http.get<AnneeScolaire[]>(this.baseUrl+"get-all-annee");
  }

  // ----------------update annee
  updateAnnee(annee: AnneeScolaire) : Observable<Response_String>{
    return this.http.put<Response_String>(this.baseUrl+"updat-anne-scolaire", annee);
  }
  // ------------------delete by idAnnee
  deleteAnnee(idAnnee: number) : Observable<Response_String>{
    return this.http.delete<Response_String>(`${this.baseUrl}delete-annee-scolaire/${idAnnee}`);
  }
  // -----------------get all superior annee scolaire
  getSuperiorAnnee() : Observable<AnneeScolaire[]>{
    return this.http.get<AnneeScolaire[]>(this.baseUrl+"get-superior-annee");
  }
}

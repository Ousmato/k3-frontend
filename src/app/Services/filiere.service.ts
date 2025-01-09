import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Filiere } from '../Admin/Models/Filieres';
import { Observable } from 'rxjs';
import { NivFiliere } from '../Admin/Models/NivFiliere';

@Injectable({
  providedIn: 'root'
})
export class FiliereService {

  constructor(private http: HttpClient) { }
  private baseUrl = `${environment.apiUrl}api-filiere/`;

  
  getAll_filiere(): Observable<Filiere[]> {
    return this.http.get<Filiere[]>(this.baseUrl + "readAll");
  }

  getAll_Niveau_filiere(): Observable<NivFiliere[]> {
    return this.http.get<NivFiliere[]>(this.baseUrl + "list-mentions");
  }
}

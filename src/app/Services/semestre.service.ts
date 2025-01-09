import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Semestres } from '../Admin/Models/Semestre';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SemestreService {

  constructor(private http: HttpClient) { }
  private baseUrl = `${environment.apiUrl}api-semestre/`;

  getCurentSemestre() : Observable<Semestres>{
    return this.http.get<any>(this.baseUrl + 'current');
  }
  // -----------------------------get all semestre------
  getAllSemestre() : Observable<Semestres[]>{
    return this.http.get<any>(this.baseUrl + 'list');
  }

  getCurrentSemestresOfYear(): Observable<Semestres[]>{
    return this.http.get<Semestres[]>(this.baseUrl+"current-semestre-of-year")
  }
  getCurrentSemestresByIdNivFiliere(idClasse: number): Observable<Semestres[]>{
    return this.http.get<Semestres[]>(this.baseUrl+"all-semestre-by-idClasse/"+ idClasse);
  }
  // ---------------------------get semestre by id classe

  get_by_classe(idClasse: number) : Observable<Semestres>{
   return this.http.get<Semestres>(this.baseUrl+"semestre-by-classe-id/"+ idClasse)
  }

}

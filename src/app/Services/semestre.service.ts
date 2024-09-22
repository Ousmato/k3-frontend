import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Semestres } from '../Admin/Models/Semestre';

@Injectable({
  providedIn: 'root'
})
export class SemestreService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:8080/api-semestre/';

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
  getCurrentSemestresByIdNivFiliere(idNivFil: number): Observable<Semestres[]>{
    return this.http.get<Semestres[]>(this.baseUrl+"all-semestre-by-idNiv-fil/"+ idNivFil);
  }
  // ---------------------------get semestre by id classe

  get_by_classe(idClasse: number) : Observable<Semestres>{
   return this.http.get<Semestres>(this.baseUrl+"semestre-by-classe-id/"+ idClasse)
  }

}

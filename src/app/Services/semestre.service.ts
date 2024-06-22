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
}

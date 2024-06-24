import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Seances } from '../../Models/Seances';

@Injectable({
  providedIn: 'root'
})
export class SeancService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:8080/api-seance/'
  // -----------------------------get all seances
  getAll() : Observable<Seances[]>{
    return this.http.get<Seances[]>(this.baseUrl + 'list');
  }
  // ------------------------------add seance
  create(seance: Seances): Observable<any>{
    return this.http.post<any>(this.baseUrl + 'add', seance);
  }
}

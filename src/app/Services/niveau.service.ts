import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Niveau } from '../Admin/Models/Niveau';

@Injectable({
  providedIn: 'root'
})
export class NiveauService {

  constructor(private http: HttpClient) { }
  private baseUrl = `${environment.apiUrl}api-niveau/`;

  getAll(): Observable<Niveau[]> {
    return this.http.get<Niveau[]>(this.baseUrl + "readAll");
  }
}

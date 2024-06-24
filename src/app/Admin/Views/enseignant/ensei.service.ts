import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Teacher } from '../../Models/Teachers';

@Injectable({
  providedIn: 'root'
})
export class EnseiService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:8080/api-teacher/'

  // -----------------------------get all enseignants
  getAll() : Observable<Teacher[]>{
    return this.http.get<Teacher[]>(this.baseUrl + 'list');
  }
  // -----------------------------add enseignant
  create(teacher: Teacher, photo: File): Observable<any>{
    const formData = new FormData();
    formData.append('teacher', JSON.stringify(teacher));
    formData.append('file', photo!);
    return this.http.post<any>(this.baseUrl + 'add', formData);
  }
}

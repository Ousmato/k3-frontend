import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Teacher } from '../../Models/Teachers';
import { Teacher_presence } from '../../Models/objectPresence';
import { Seances } from '../../Models/Seances';
import { Presence } from '../../Models/Teacher-presence';

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
  // --------------------get all enseignants have emplois active
  getAllHaveEmplois() : Observable<Teacher_presence[]>{
    return this.http.get<Teacher_presence[]>(this.baseUrl + 'all_teacher_seance_actif');
  }
  // -----------------------------add enseignant
  create(teacher: Teacher, photo: File): Observable<any>{
    const formData = new FormData();
    formData.append('teacher', JSON.stringify(teacher));
    formData.append('file', photo!);
    return this.http.post<any>(this.baseUrl + 'add', formData);
  }
  // ------------------------------get enseignant detaille  emplois by id 
  getTeacherPresence(id: number ) : Observable<Teacher_presence>{
    return this.http.get<Teacher_presence>(this.baseUrl + 'detaille/' + id);
  }
  // -------------------------------method to add presence
  addPresence(idSeance: Presence) : Observable<any>{
    return this.http.post<any>(this.baseUrl+ "add-presence", idSeance);
  }
  // ------------------------------method pour absenter un teacher
  abscenter(teachId : number) : Observable<boolean>{
    return this.http.get<boolean>(this.baseUrl+"abscent/"+teachId);
  }
  // ------------get status
  getStatus(idTeacher : number) : Observable<boolean>{
    return this.http.get<boolean>(this.baseUrl+"status/"+idTeacher);
  }
}

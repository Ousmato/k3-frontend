import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Teacher } from '../../Models/Teachers';
import { Teacher_presence } from '../../Models/objectPresence';
import { Seances } from '../../Models/Seances';
import { Presence } from '../../Models/Teacher-presence';
import { Paie } from '../../Models/paie';
import { Response_String } from '../../Models/Response_String';
import { TeacherPages } from '../../Models/TeachesPage';

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
  create(teacher: Teacher, photo: File): Observable<Response_String>{
    const formData = new FormData();
    formData.append('teacher', JSON.stringify(teacher));
    formData.append('file', photo!);
    return this.http.post<Response_String>(this.baseUrl + 'add', formData);
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
  abscenter(idSeance : Presence) : Observable<any>{
    console.log(idSeance, "service")
    return this.http.post<any>(this.baseUrl+ "abscent", idSeance);
  }
  // ------------get status
  getStatus(idTeacher : number) : Observable<Presence[]>{
    return this.http.get<Presence[]>(this.baseUrl+"status/"+idTeacher);
  }
  // ---------------------------------get All teacher in presence
  getAllPresence() : Observable<Presence[]>{
    return this.http.get<Presence[]>(this.baseUrl + 'list-presence');
  }
  // --------------------------------add paie
  addPaie(paie: Paie) : Observable<any>{
    return this.http.post<any>(this.baseUrl+"add-paie", paie);
  }
  // -----------------------------------get all paie
  getAllPaie() : Observable<Paie[]>{
    return this.http.get<Paie[]>(this.baseUrl + 'list-paie');
  }
  // -------------------------------------------update teacher
  updateTeacher(teacher: Teacher, photo: File): Observable<Response_String>{
    const formData = new FormData();
    formData.append('teacher', JSON.stringify(teacher));
      formData.append('file', photo);
    return this.http.put<Response_String>(this.baseUrl + 'update', formData);
  }
  // -----------------------get teacher by id
  getTeacher_by_id(idTeacher: number) : Observable<Teacher>{
    return this.http.get<Teacher>(this.baseUrl+"teacher-by-id/"+idTeacher)
  }
  // ----------------------------------lad teacher by pagination
  getTeachers(page: number, size: number): Observable<TeacherPages> {
    return this.http.get<TeacherPages>(`${this.baseUrl}list?page=${page}&size=${size}`);
  }
}

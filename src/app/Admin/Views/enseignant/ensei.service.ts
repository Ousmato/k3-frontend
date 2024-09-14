import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Teacher } from '../../Models/Teachers';
import { Teacher_presence } from '../../Models/objectPresence';
import { Seances } from '../../Models/Seances';
import { Presence } from '../../Models/Teacher-presence';
import { Paie, PaieDTO } from '../../Models/paie';
import { Response_String } from '../../Models/Response_String';
import { Paie_Pages, Presence_pages, Teacher_presence_pages, TeacherPages } from '../../Models/Pagination-module';

@Injectable({
  providedIn: 'root'
})
export class EnseiService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:8080/api-teacher/'

  // -----------------------------get all enseignants
  getAll() : Observable<Teacher[]>{
    return this.http.get<Teacher[]>(this.baseUrl + 'list-all');
  }
  // --------------------get all enseignants have emplois active
  getAllHaveEmplois() : Observable<Teacher_presence[]>{
    return this.http.get<Teacher_presence[]>(this.baseUrl + 'all_teacher_seance_actif');
  }
  getPage_teacher_HaveEmplois(page: number, size: number): Observable<Teacher_presence_pages> {
    return this.http.get<Teacher_presence_pages>(`${this.baseUrl}get-page-teacher-seance-actif?page=${page}&size=${size}`);
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
  addPresence(idSeance: Presence) : Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl+ "add-presence", idSeance);
  }
  // ------------------------------method pour absenter un teacher
  chage_observation(idSeance : Presence) : Observable<Response_String>{
    console.log(idSeance, "service")
    return this.http.post<Response_String>(this.baseUrl+ "change-observation", idSeance);
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
  getAll_Teacher_By_IdUe(idUe : number) : Observable<Teacher[]>{
    return this.http.get<Teacher[]>(this.baseUrl+"list-teacher-by-idUe/"+ idUe);
  }
  // -----------------------------------get all paie
  // getAllPaie(page: number, size: number) : Observable<Paie_Pages>{
  //   return this.http.get<Paie_Pages>(`${this.baseUrl}list-paie?page=${page}&size=${size}`);
  // }
  getAllPaie(): Observable<PaieDTO[]>{
    return this.http.get<PaieDTO[]>(this.baseUrl+"list-paie")
  }
  // ----------------------get all hours paie of teacher
  getPaieBy_Enseignant_id(idEnseignant : number) : Observable<Paie[]>{
    return this.http.get<Paie[]>(this.baseUrl+"all-hours-paie-of-teacher/" + idEnseignant)
  }
  // -------------------------------------------update teacher
  updateTeacher(teacher: Teacher): Observable<Response_String>{
    // const formData = new FormData();
    // formData.append('teacher', JSON.stringify(teacher));
      // formData.append('file', photo);
    return this.http.put<Response_String>(this.baseUrl + 'update', teacher);
  }
  // -----------------------get teacher by id
  getTeacher_by_id(idTeacher: number) : Observable<Teacher>{
    return this.http.get<Teacher>(this.baseUrl+"teacher-by-id/"+idTeacher)
  }
  // ----------------------------------lad teacher by pagination
  getTeachers(page: number, size: number): Observable<TeacherPages> {
    return this.http.get<TeacherPages>(`${this.baseUrl}list?page=${page}&size=${size}`);
  }
  // -----------------------------------method pour appeller tous les presence du mois
  getAll_presence_ofMonth(page: number, size: number): Observable<Presence_pages> {
    return this.http.get<Presence_pages>(`${this.baseUrl}list-presence?page=${page}&size=${size}`);
  }
  // ------------------------get presence by id seance
  getPresence_by_seance(idSeance: number) : Observable<Presence>{
    return this.http.get<Presence>(this.baseUrl+"presence-by-idseance/"+idSeance)
  }

  // ---------------------------get nombre enseignant
  countTeacherNumber() : Observable<number>{
    return this.http.get<number>(this.baseUrl+"count-teacher-number")
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../../Models/Students';
import { Notes } from '../../Models/Notes';
import { Module } from '../../Models/Module';

@Injectable({
  providedIn: 'root'
})
export class EtudeService {

  constructor(private http: HttpClient) { }

  private getUrl = 'http://localhost:8080/api-student/list'
  private baseUrl = 'http://localhost:8080/api-student/'
  private baseUrl_note = 'http://localhost:8080/api-note/'
  getAll() : Observable<any>{
    return this.http.get<Student>(this.getUrl);
  }
  // ----------------------get all student by idclasse
  getStudentByIdClasse(idClasse: number) : Observable<Student[]>{
    return this.http.get<Student[]>(this.baseUrl + "list-student-by-classe/" + idClasse);
  }
  // ------------------------add note
  add_note(note: Notes) : Observable<any>{
    return this.http.post<any>(this.baseUrl_note+"add-note", note);
  }

   // -----------------------------------get all module filter
   getAllModulesWithoutNoteFilter(id: number, idClass: number): Observable<Module[]> {
    return this.http.get<Module[]>(this.baseUrl_note + "all-Modules-filter/" +id+"/"+ idClass);
   
  }
  // -------------------get note of student in current semestre
   getAllNoteByIdStudent(id: number, idSemestre: number): Observable<Notes[]> {
    return this.http.get<Notes[]>(this.baseUrl_note + "read/" +id+"/"+ idSemestre);
   
  }
  // ----------------------------------get all note of classe
  getAllNoteByClasse(idClasse: number): Observable<Notes[]> {
    return this.http.get<Notes[]>(this.baseUrl_note + "read-all-of-semestre/" +idClasse);
   
  }
}

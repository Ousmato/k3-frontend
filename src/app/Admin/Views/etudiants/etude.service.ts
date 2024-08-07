import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../../Models/Students';
import { Notes } from '../../Models/Notes';
import { Module } from '../../Models/Module';
import { Response_String } from '../../Models/Response_String';
import { NotesPages, StudentPages } from '../../Models/Pagination-module';

@Injectable({
  providedIn: 'root'
})
export class EtudeService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:8080/api-student/'
  private baseUrl_note = 'http://localhost:8080/api-note/'
  getAll() : Observable<Student[]>{
    return this.http.get<Student[]>(this.baseUrl+"find-all");
  }
  // ----------------------get all student by idclasse
  
  getStudentByIdClasse(idClasse: number) : Observable<Student[]>{
    return this.http.get<Student[]>(this.baseUrl + "list-student-by-classe/" + idClasse);
  }

  getStudent_ByIdClasse(page: number, size: number, idClasse: number): Observable<StudentPages> {
    return this.http.get<StudentPages>(`${this.baseUrl}list-student-by-classe/${idClasse}?page=${page}&size=${size}`);
  }
  
  // ------------------------add note
  add_note(note: Notes) : Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl_note+"add-note", note);
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
  // read-all-of-semestre/
  getAllNoteByClasse(page: number, size: number, idClasse: number): Observable<NotesPages> {
    return this.http.get<NotesPages>(`${this.baseUrl_note}read-all-of-semestre/${idClasse}?page=${page}&size=${size}`);
  }
  // -----------------------------------------desactive student by id
  desactiveStudent(id: number): Observable<Response_String>{
    return this.http.get<Response_String>(this.baseUrl + "desable/" + id);
  }
  // ------------------------get stuudent by id
  getStudent_by_id(idStudent: number) : Observable<Student>{
    return this.http.get<Student>(this.baseUrl+"student-by-id/"+idStudent)
  }
  // ---------------------update student
  updateStudent(student: Student, file?: File): Observable<Response_String> {
    const formData = new FormData();
    formData.append('student', JSON.stringify(student));
    formData.append('file', file!);
    return this.http.put<Response_String>(this.baseUrl + 'update', formData);
  }
  // -----------------------update scolarite
  update_student_scolarite(idEtudiant: number, scolarite: number): Observable<Response_String> {
    const url = `${this.baseUrl}update-scolarite/${idEtudiant}`;
    return this.http.put<Response_String>(url, { scolarite });
  }
  // ----------------------------------lad teacher by pagination
  getSudents(page: number, size: number): Observable<StudentPages> {
    return this.http.get<StudentPages>(`${this.baseUrl}list?page=${page}&size=${size}`);
  }
  // ----------------------------------update note
  update_note(note: Notes) : Observable<Response_String>{
    return this.http.put<Response_String>(this.baseUrl_note+"update-note", note);
  }
}

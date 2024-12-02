import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response_String } from '../Admin/Models/Response_String';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private baseUrl =`${ environment.apiUrl}api-note/`;
  constructor(private http: HttpClient) { }

  calculateNote(idStudent: number, idSemestream: number) : Observable<Response_String>{
    return this.http.get<Response_String>(`${this.baseUrl}calculate-studen-moyen-by-semestre/${idStudent}/${idSemestream}`);
  }

  // get all ids of students have all notes for semestre
  getAllStudentIdsBySemestre(idSemestre: number, idNivFiliere: number, idClasse: number) : Observable<number[]>{
    return this.http.get<number[]>(`${this.baseUrl}get-ids-of-students/${idSemestre}/${idNivFiliere}/${idClasse}`);
  }
}

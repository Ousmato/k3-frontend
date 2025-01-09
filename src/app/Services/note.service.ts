import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { finalize, Observable } from 'rxjs';
import { Response_String } from '../Admin/Models/Response_String';
import { AddNoteDtoPages } from '../Admin/Models/Pagination-module';
import { LoaderService } from './loader.service';
import { AddNoteDto } from '../Admin/Models/Notes';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private baseUrl =`${ environment.apiUrl}api-note/`;
  constructor(private http: HttpClient, private loaderService: LoaderService) { }

  calculateNote(idStudent: number, idSemestream: number) : Observable<Response_String>{
    return this.http.get<Response_String>(`${this.baseUrl}calculate-studen-moyen-by-semestre/${idStudent}/${idSemestream}`);
  }

  // get all ids of students have all notes for semestre
  getAllStudentIdsBySemestre(idSemestre: number, idNivFiliere: number, idClasse: number) : Observable<number[]>{
    return this.http.get<number[]>(`${this.baseUrl}get-ids-of-students/${idSemestre}/${idNivFiliere}/${idClasse}`);
  }

  
  // add note for inscriptions in this classe by module for semestre
  getAllNotesInscriptionPagesByModule(idClasse: number, idAnnee: number, idSemestre: number, moduleid: number, page: number, size: number): Observable<AddNoteDtoPages>{
    this.loaderService.loading()
    return this.http.get<AddNoteDtoPages>(`${this.baseUrl}add-note-all-inscrit-of-class/${idClasse}/${idAnnee}/${idSemestre}/${moduleid}?page=${page}&${size}`).pipe(
      finalize(() => this.loaderService.stopLoading())
    )
  }

  // add note
  add_note(note: any) : Observable<AddNoteDto>{
    return this.http.post<AddNoteDto>(this.baseUrl+"add-note", note);
  }

  
}

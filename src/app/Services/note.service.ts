import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { finalize, Observable } from 'rxjs';
import { Response_String } from '../Admin/Models/Response_String';
import { AddNoteDtoPages, NotesPages } from '../Admin/Models/Pagination-module';
import { LoaderService } from './loader.service';
import { AddNoteDto, StudentMoyenne } from '../Admin/Models/Notes';
import { InscriptionNoteDto } from '../Admin/Models/Students';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private baseUrl =`${ environment.apiUrl}api-note/`;
  constructor(private http: HttpClient, private loaderService: LoaderService) { }

  calculateNote(idClasse: number, idSemestream: number) : Observable<Response_String>{
    return this.http.get<Response_String>(`${this.baseUrl}calculate-students-moyens-by-semestre/${idClasse}/${idSemestream}`);
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
  add_note(note: any) : Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl+"add-note", note);
  }
  // read-all-of-semestre/
    getAllNoteByClasse(page: number, size: number, idClasse: number, idSemestre: number): Observable<NotesPages> {
      this.loaderService.loading();
      
      return this.http.get<NotesPages>(`${this.baseUrl}read-all-of-semestre/${idClasse}/${idSemestre}?page=${page}&size=${size}`).pipe(
        finalize(() => this.loaderService.stopLoading())
      );
    }

    // get all moyennes of class by semestre
    getAllMoyenneByIdClassAndSemestre(idClasse: number, idSemestre: number) : Observable<StudentMoyenne[]>{
      this.loaderService.loading
      return this.http.get<StudentMoyenne[]>(`${this.baseUrl}get-all-moyennes-of-class-by-semestre/${idClasse}/${idSemestre}`).pipe(
        finalize (() => this.loaderService.stopLoading())
      )
    }

    // get all semestre moyen of class
    getAllSemestreMoyen(idClasse: number) : Observable<InscriptionNoteDto[]>{
      this.loaderService.loading()
      return this.http.get<InscriptionNoteDto[]>(`${this.baseUrl}get-student-note-of-semestre-by-idClasse/${idClasse}`).pipe(
        finalize(() => this.loaderService.stopLoading())
      )
    }

  
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, map, Observable } from 'rxjs';
import { ClassModules } from '../../Admin/Models/ClassModule';
import { Module } from '../../Admin/Models/Module';
import { AddUeDto, Ue } from '../../Admin/Models/UE';
import { ClassRoom } from '../../Admin/Models/Classe';
import { Response_String } from '../../Admin/Models/Response_String';
import { NivFiliere } from '../../Admin/Models/NivFiliere';
import { environment } from '../../../environments/environment';
import { AddNoteDto } from '../../Admin/Models/Notes';
import { LoaderService } from '../../Services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class ClassStudentService {

  constructor(private http: HttpClient, private loadingService: LoaderService) { }
  private baseUrl = `${environment.apiUrl}api-class/`;

  // ---------------------------------------
  getAllCurrentClassOfYear(idAdmin: number): Observable<ClassRoom[]> {
    this.loadingService.loading();
    return this.http.get<ClassRoom[]>(this.baseUrl + "list-class/"+idAdmin).pipe(
      map(response => response),
      finalize(() => {
        // Arrêter le loader lorsque la requête est terminée
        this.loadingService.stopLoading(); 
      }),
    );
  }

  // ---------------------get all classe by type doc
  getListClassByTypeDoc(type: number) : Observable<ClassRoom[]>{
    return this.http.get<ClassRoom[]>(this.baseUrl+"classe-type-of-doc/"+type)
  }
  getCurrentClassOfYearWithUe(): Observable<ClassRoom[]> {
    return this.http.get<ClassRoom[]>(this.baseUrl + "current-classe-with-ue");
  }

  getAllClasse(idAnnee: number, idAdmin: number) : Observable<ClassRoom[]> {
    return this.http.get<ClassRoom[]>(`${this.baseUrl}get-all-classe-by-id-annee/${idAnnee}/${idAdmin}`);
  }
  // -------------------------------------add modules in classroom
  createClassModule(modules: ClassModules): Observable<Response_String> {
    return this.http.post<Response_String>(`${this.baseUrl}add-module-class`, modules);
  }
  //  ------------------------get class by id
  getClassById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}class/${id}`);
  }

  // get class room by id niveau filiere
  getClassByIdNivFiliere(idNivFil: number): Observable<ClassRoom> {
    return this.http.get<ClassRoom>(`${this.baseUrl}classe-by-idNivFiliere/${idNivFil}`);
  }
  //  ------------------------get All module of class
  getAllModules(id: number): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.baseUrl}all-module/${id}`);

  }

  // --------------------get all modules of class by idClasse and idSemestre
  getAllModulesByClasseAndSemestre(idClasse: number, idSemestre: number): Observable<Module[]> {
    return this.http.get<Module[]>(this.baseUrl + "all-module-by-classe-semestre/" + idClasse + "/" + idSemestre);
  }
  //  ------------------------get all module without note in classe
  getAllModulesWithoutNote(idClasse: number): Observable<Module[]> {
    return this.http.get<Module[]>(this.baseUrl + "all-module-without-note/" + idClasse);

  }
  // ---------------------all module without note
  allModuleWithoutNotes(): Observable<Module[]> {
    return this.http.get<Module[]>(this.baseUrl + "all-module-without-note_all");
  }
  // ------------------------------------------------------------------
  getAllModulesByUeId(idUe: number): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.baseUrl}list-by-idUe/${idUe}`);
  }

  getModulesWithoutEmploi(idNivFil: number, idSemestre: number): Observable<AddNoteDto[]> {
    return this.http.get<AddNoteDto[]>(`${this.baseUrl}all-modules-without-emploi/${idNivFil}/${idSemestre}`);
  }
  // get all ue by classe id
  getAll_ue(idClasseNivFil: number, idSemestre: number): Observable<AddUeDto[]> {
    return this.http.get<AddUeDto[]>(`${this.baseUrl}list-ue-idClasse-idSemestre/${idClasseNivFil}/${idSemestre}`);
  }
  getAll_ue_toAddNote(idClasseNivFil: number, idSemestre: number, idStudent: number): Observable<AddNoteDto[]> {
    return this.http.get<AddNoteDto[]>(`${this.baseUrl}list-ue/${idClasseNivFil}/${idSemestre}/${idStudent}`);
  }
  getAllUeByIdClasse(idClasse: number): Observable<Ue[]> {
    return this.http.get<Ue[]>(this.baseUrl + "all-ue-by-idClasse/" + idClasse)
  }
  // --------------------------------------------update classe
  update_classe(classe: ClassRoom): Observable<Response_String> {
    return this.http.put<Response_String>(this.baseUrl + 'update-class', classe);
  }

  // ----------------count class number
  countClassNumber(): Observable<number> {
    return this.http.get<number>(this.baseUrl + 'count-class');
  }

  // -----------------------get all archives of classe by idNivFil(mention)
  getAllArchivesByClasseIdNivFil(idNivFil: number): Observable<ClassRoom[]> {
    console.log(idNivFil, "idNivFil")
    return this.http.get<ClassRoom[]>(this.baseUrl + "get-all-archives-by-class-id/" + idNivFil);
  }

  getAllNivFil(): Observable<NivFiliere[]> {
    return this.http.get<NivFiliere[]>(this.baseUrl + "all-niv-filiere");
  }

  // -----------------------add pomotion classe
  addProClasse(idNivFil: number, idAnnee: number,): Observable<Response_String> {
    return this.http.get<Response_String>(this.baseUrl + "add-promotion-classe/" + idAnnee + "/" + idNivFil);
  }
  // -------------------------delete promotion classe
  deleteProClasse(idClasse: number): Observable<Response_String> {
    return this.http.delete<Response_String>(this.baseUrl + "delete-promotion-classe/" + idClasse);
  }
  // -----------update promotion classe
  updateProClasse(idClasse: number, idAnnee: number,): Observable<Response_String> {
    return this.http.get<Response_String>(this.baseUrl + "update-promotion-classe/" + idAnnee + "/" + idClasse);
  }
  // // ---------------------------get list of supperior class
  // getNextClasseByIdPrevious(idClasse: number): Observable<ClassRoom[]> {
  //   return this.http.get<ClassRoom[]>(this.baseUrl + "get-all-next-classe-by-id/" + idClasse);
  // }

  // update ue
  update_ue(ue: Ue): Observable<Response_String> {
    return this.http.put<Response_String>(this.baseUrl + 'update-ue', ue);
  }
}

import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Niveau } from '../../Models/Niveau';
import { Filiere } from '../../Models/Filieres';
import { NivFiliere } from '../../Models/NivFiliere';
import { ClassRoom } from '../../Models/Classe';
import { Ue } from '../../Models/UE';
import { Module } from '../../Models/Module';
import { Semestres } from '../../Models/Semestre';
import { error } from 'jquery';
import { Response_String } from '../../Models/Response_String';

@Injectable({
  providedIn: 'root'
})
export class SetService {

  constructor(private http: HttpClient) { }
 private getUrl = 'http://localhost:8080/niveau/readAll';
 private baseUrl = 'http://localhost:8080/';
 private postUrl = 'http://localhost:8080/filiere/addFiliere';
 private getNivFiltUrl = 'http://localhost:8080/filiere/liste';
 private postClassUrl = 'http://localhost:8080/class/add';
  

    getAll() : Observable<Niveau[]>{
      return this.http.get<Niveau[]>(this.getUrl);
    }
  getAll_Niveau_filiere() : Observable<NivFiliere[]>{
    return this.http.get<NivFiliere[]>(this.getNivFiltUrl);
  }
  // -------------------------------------------------update niveau filiere
  updateNiveauFiliere(nivFiliere: NivFiliere) : Observable<any>{
    return this.http.put<any>(this.baseUrl+"filiere/update-niveau-filiere", nivFiliere);
  }
    createFiliere(filiere: Filiere): Observable<Filiere>{
      return this.http.post<Filiere>(this.postUrl, filiere);
    }
    addClass(classe: ClassRoom) : Observable<Response_String>{
      return this.http.post<Response_String>(this.baseUrl+"api-class/add", classe);
    }

    addFiliere(filiereData: any): Observable<Response_String> {
      return this.http.post<Response_String>(this.baseUrl+"filiere/add", filiereData);
  }


  // -----------------------------------------create ue 
  createUe(ue: Ue) : Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl+"api-class/add-ue", ue);
  }
  // -----------------------------------------get all ue by class id
  getAll_ue_not_associate_class(idClasse: number): Observable<Ue[]> {
    return this.http.get<Ue[]>(`${this.baseUrl}api-class/list-ue/${idClasse}`);
  }
  // ----------------------------------------------add module
  createModule(module: Module): Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl+"api-class/add-module", module);
  }
  // -----------------------------------get all module
  getAll_module() : Observable<Module[]>{
    return this.http.get<Module[]>(this.baseUrl+"api-class/list-module");
  }
  // -------------------------get all ue
  getAll_ue_all(): Observable<Ue[]> {
    return this.http.get<Ue[]>(`${this.baseUrl}api-class/all-ue`);
  }
  // -------------------------get all ue
  getAll_ue_all_without_module_and_classe(): Observable<Ue[]> {
    return this.http.get<Ue[]>(`${this.baseUrl}api-class/all-ues-without-modules-and-classe`);
  }
  // -----------------------------update ue
  updateUe(ue: Ue): Observable<Response_String>{
    return this.http.put<Response_String>(this.baseUrl+"api-class/update-ue", ue);
  }
  // -----------------------------update module
  updateModule(module: Module): Observable<Response_String>{
    return this.http.put<Response_String>(this.baseUrl+"api-class/update-module", module);
  }
  // -----------------------------delete module
  deleteModule(id: number): Observable<Response_String>{
    return this.http.delete<Response_String>(`${this.baseUrl}api-class/delete-module-by-id/${id}`);
  }
  // -----------------------------delete ue
  deleteUe(id: number): Observable<Response_String>{
    return this.http.delete<Response_String>(`${this.baseUrl}api-class/delete-ue-by-id/${id}`);
  }
  // ---------------------------------------get all semestre
  getSemestres() : Observable<Semestres[]>{
    return this.http.get<Semestres[]>(this.baseUrl+"api-semestre/list");
  }
  // ------------------------------------update semestre
  updateSemestre(semestre: Semestres) : Observable<Response_String>{
    return this.http.put<Response_String>(this.baseUrl+"api-semestre/update", semestre)
  }
  // -----------------------------get all module by class id
  getAll_module_without_note(): Observable<Module[]>{
    return this.http.get<Module[]>(this.baseUrl+"api-class/all-module-without-note_all");
  }
// --------------------------------add semestre
createSemestre(semestre: Semestres) : Observable<Response_String>{
  return this.http.post<Response_String>(this.baseUrl+"api-semestre/add-semestre", semestre);
}
 
}

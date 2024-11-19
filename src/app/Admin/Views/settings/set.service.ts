import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Niveau } from '../../Models/Niveau';
import { Filiere } from '../../Models/Filieres';
import { NivFiliere } from '../../Models/NivFiliere';
import { AddUeDto, Ue } from '../../Models/UE';
import { Module } from '../../Models/Module';
import { Semestres } from '../../Models/Semestre';
import { Response_String } from '../../Models/Response_String';

@Injectable({
  providedIn: 'root'
})
export class SetService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:8080/';


  getAll(): Observable<Niveau[]> {
    return this.http.get<Niveau[]>(this.baseUrl + "api-niveau/readAll");
  }
  getAll_Niveau_filiere(): Observable<NivFiliere[]> {
    return this.http.get<NivFiliere[]>(this.baseUrl + "api-filiere/list-mentions");
  }
  // ----------------------------all filiere
  getAll_filiere(): Observable<Filiere[]> {
    return this.http.get<Filiere[]>(this.baseUrl + "api-filiere/readAll");
  }
  // // -------------------------------------------------update niveau filiere
  // updateNiveauFiliere(nivFiliere: NivFiliere) : Observable<any>{
  //   return this.http.put<any>(this.baseUrl+"filiere/update-niveau-filiere", nivFiliere);
  // }
  createFiliere(filiere: Filiere): Observable<Response_String> {
    return this.http.post<Response_String>(this.baseUrl + "api-filiere/addFiliere", filiere);
  }
  addNiveauFiliere(nivFiliere: NivFiliere): Observable<Response_String> {
    return this.http.post<Response_String>(this.baseUrl + "api-class/add-niv-fili", nivFiliere);
  }
  // -----------------update nivfiliere
  updateNiveauFiliere(nivFiliere: NivFiliere): Observable<Response_String> {
    return this.http.put<Response_String>(this.baseUrl + "api-class/update-niv-filiere", nivFiliere);
  }
  // ----------------------------update filiere
  updateFiliere(filiere: Filiere): Observable<Response_String> {
    return this.http.put<Response_String>(this.baseUrl + "api-filiere/update", filiere);
  }
  // -----------------------------------------create ue 
  createUe(dto: AddUeDto): Observable<Response_String> {
    return this.http.post<Response_String>(this.baseUrl + "api-class/add-ue", dto);
  }
  // -----------------------------------------get all ue by class id
  getAll_ue_not_associate_class(idClasse: number): Observable<Ue[]> {
    return this.http.get<Ue[]>(`${this.baseUrl}api-class/list-ue/${idClasse}`);
  }

  // -----------------------------------get all module
  getAll_module(): Observable<Module[]> {
    return this.http.get<Module[]>(this.baseUrl + "api-class/list-module");
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
  updateUe(ue: AddUeDto): Observable<Response_String> {
    return this.http.put<Response_String>(this.baseUrl + "api-class/update-ue", ue);
  }
  // -----------------------------update module
  updateModule(module: Module): Observable<Response_String> {
    return this.http.put<Response_String>(this.baseUrl + "api-class/update-module", module);
  }
  // -----------------------------delete module
  deleteModule(id: number): Observable<Response_String> {
    return this.http.delete<Response_String>(`${this.baseUrl}api-class/delete-module-by-id/${id}`);
  }
  // -----------------------------delete ue
  deleteUe(id: number): Observable<Response_String> {
    return this.http.delete<Response_String>(`${this.baseUrl}api-class/delete-ue-by-id/${id}`);
  }
  // ---------------------------------------get all semestre
  getSemestres(): Observable<Semestres[]> {
    return this.http.get<Semestres[]>(this.baseUrl + "api-semestre/list");
  }
  // ------------------------------------update semestre
  updateSemestre(semestre: Semestres): Observable<Response_String> {
    return this.http.put<Response_String>(this.baseUrl + "api-semestre/update", semestre)
  }
  // -----------------------------get all module by class id
  getAll_module_without_note(): Observable<Module[]> {
    return this.http.get<Module[]>(this.baseUrl + "api-class/all-module-without-note_all");
  }
  // --------------------------------add semestre
  createSemestre(semestre: Semestres): Observable<Response_String> {
    return this.http.post<Response_String>(this.baseUrl + "api-semestre/add-semestre", semestre);
  }

  // ---------------------add niveau
  addNiveau(niveau: Niveau): Observable<Response_String> {
    return this.http.post<Response_String>(this.baseUrl + "api-niveau/add-niveau", niveau);
  }
  // ----------------update niveau
  updateNiveau(niveau: Niveau): Observable<Response_String> {
    return this.http.put<Response_String>(this.baseUrl + "api-niveau/update-niveau", niveau);
  }

  // ------------------------------delete
  deleteNiveau(idNiveau: number): Observable<Response_String> {
    return this.http.delete<Response_String>(`${this.baseUrl}api-niveau/delete-niveau/${idNiveau}`);
  }

  // ----------------------read all niveau
  getAllNiveau(): Observable<Niveau[]> {
    return this.http.get<Niveau[]>(this.baseUrl + "api-niveau/readAll")
  }

  // ----------------------------delete filiere
  deleteFiliere(idFiliere: number): Observable<Response_String> {
    return this.http.delete<Response_String>(`${this.baseUrl}api-filiere/filiere-delete/${idFiliere}`);
  }


}

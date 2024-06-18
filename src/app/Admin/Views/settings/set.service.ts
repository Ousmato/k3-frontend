import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Niveau } from '../../Models/Niveau';
import { Filiere } from '../../Models/Filieres';
import { NivFiliere } from '../../Models/NivFiliere';
import { ClassRoom } from '../../Models/Classe';
import { Ue } from '../../Models/UE';
import { Module } from '../../Models/Module';

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
    createFiliere(filiere: Filiere): Observable<Filiere>{
      return this.http.post<Filiere>(this.postUrl, filiere);
    }
    addClass(classe: ClassRoom) : Observable<any>{
      return this.http.post<any>(this.postClassUrl, classe);
    }

    addFiliere(filiereData: any): Observable<any> {
      console.log(filiereData, "------------------------------------------------");
      return this.http.post<any>(this.baseUrl+"filiere/add", filiereData);
  }
  // -----------------------------------------create ue 
  createUe(ue: Ue) : Observable<any>{
    return this.http.post<any>(this.baseUrl+"api/add-ue", ue);
  }
  // -----------------------------------------get all ue
  getAll_ue(idClasse: number): Observable<Ue[]> {
    return this.http.get<Ue[]>(`${this.baseUrl}api/list-ue`, {
      params: new HttpParams().set('idClasse', idClasse.toString())
    });
  }
  // ----------------------------------------------add module
  createModule(module: Module): Observable<any>{
    return this.http.post<any>(this.baseUrl+"api/add-module", module);
  }
  // -----------------------------------get all module
  getAll_module() : Observable<Module[]>{
    return this.http.get<Module[]>(this.baseUrl+"api/list-module");
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClassModules } from '../../Models/ClassModule';
import { Module } from '../../Models/Module';
import { Ue } from '../../Models/UE';

@Injectable({
  providedIn: 'root'
})
export class ClassStudentService {

  constructor(private http : HttpClient) { }
  private getAll_url = 'http://localhost:8080/api-class/list-class';
  private baseUrl = "http://localhost:8080/api-class/";

  getAll() : Observable<any>{
    return this.http.get<any>(this.getAll_url);
  }
  // -------------------------------------add modules in classroom
  createClassModule(modules: ClassModules[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}add-module-class`, modules);
  }
//  ------------------------get class by id
  getClassById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}class/${id}`);
  }
//  ------------------------get All module of class
  getAllModules(id: number): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.baseUrl}all-module/${id}`);
   
  }
//  ------------------------get all module without note
  getAllModulesWithoutNote(id: number): Observable<Module[]> {
    return this.http.get<Module[]>(this.baseUrl + "all-module-without-note/" +id);
   
  }
//  -----------------------get all ue by classe id
  getAll_ue(idClasse: number): Observable<Ue[]> {
    return this.http.get<Ue[]>(`${this.baseUrl}list-ue/${idClasse}`);
  }
  
}

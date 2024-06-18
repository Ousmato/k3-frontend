import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClassModules } from '../../Models/ClassModule';

@Injectable({
  providedIn: 'root'
})
export class ClassStudentService {

  constructor(private http : HttpClient) { }
  private getAll_url = 'http://localhost:8080/class/list-class';
  private add_url = "http://localhost:8080/class/add";
  private baseUrl = "http://localhost:8080/";

  getAll() : Observable<any>{
    return this.http.get<any>(this.getAll_url);
  }
  // -------------------------------------add modules in classroom
  createClassModule(modules: ClassModules[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}api/add-module-class`, modules);
  }
 
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../../Models/Students';

@Injectable({
  providedIn: 'root'
})
export class EtudeService {

  constructor(private http: HttpClient) { }

  private getUrl = 'http://localhost:8080/api-student/list'
  private postUrl = 'http://localhost:8080/api-student/add'
  private deleteUrl = 'http://localhost:8080/api-student/delete'
  private updateUrl = 'http://localhost:8080/api-student/update'
  private getByIdUrl = 'http://localhost:8080/api-student/read'

  getAll() : Observable<any>{
    return this.http.get<Student>(this.getUrl);
  }
}

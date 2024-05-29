import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../Admin/Models/Students';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SinginServiceService {
  private baseUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient) { }

  singIn(student: Student) :Observable<Student>{
    return this.http.post<Student>(this.baseUrl+"/add", student);
  }
}

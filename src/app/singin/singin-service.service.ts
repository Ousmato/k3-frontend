import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../Admin/Models/Students';
import { Observable } from 'rxjs';
import { ClassRoom } from '../Admin/Models/Classe';

@Injectable({
  providedIn: 'root'
})
export class SinginServiceService {
  private baseUrl = 'http://localhost:8080/api-student/add';
  constructor(private http: HttpClient) { }

  singIn(student: Student, photoFile: File): Observable<Student> {
     // Append the photo file

    const formData = new FormData();
    formData.append('student', JSON.stringify(student));
   
    formData.append('file', photoFile);
    // formData.append("idClasse", JSON.stringify(classe))
    // formData.append('idClasse', JSON.stringify(idClasse));
     console.log(formData.get('student'), formData.get('file'));

    // Send the POST request with formData
    return this.http.post<Student>(this.baseUrl, formData);
}

}

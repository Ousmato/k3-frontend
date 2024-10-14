import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../../Models/Students';
import { Observable } from 'rxjs';
import { ClassRoom } from '../../Models/Classe';
import { Response_String } from '../../Models/Response_String';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SinginServiceService {
  private baseUrl = `${environment.apiUrl}api-student/add`;
  constructor(private http: HttpClient) { }

  singIn(student: Student, photoFile: File): Observable<Response_String> {
    const formData = new FormData();
    formData.append('student', JSON.stringify(student));
   
    formData.append('file', photoFile);
     console.log(formData.get('student'), formData.get('file'));
    return this.http.post<Response_String>(this.baseUrl, formData);
}

}

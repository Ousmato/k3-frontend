import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inscription, Student } from '../../Models/Students';
import { Observable } from 'rxjs';
import { Response_String } from '../../Models/Response_String';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SinginServiceService {
  private baseUrl = `${environment.apiUrl}api-student/add`;
  constructor(private http: HttpClient) { }

  singIn(student: Inscription, photoFile: File): Observable<Response_String> {
    const formData = new FormData();
    formData.append('inscription', JSON.stringify(student));
   
    formData.append('file', photoFile);
    //  console.log(formData.get('inscription'), formData.get('file'));
    return this.http.post<Response_String>(this.baseUrl, formData);
}

}

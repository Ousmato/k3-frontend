import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Seances } from '../../Models/Seances';
import { Response_String } from '../../Models/Response_String';

@Injectable({
  providedIn: 'root'
})
export class SeancService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:8080/api-seance/'
  // -----------------------------get all seances by emplois id
  getAllByEmploisId(id: number) : Observable<Seances[]>{
    return this.http.get<Seances[]>(this.baseUrl + 'list/' + id);
  }
  
  // ------------------------------add seance
  create(seance: Seances): Observable<any>{
    return this.http.post<any>(this.baseUrl + 'add', seance);
  }
  // ---------------------------------------delete seance 
  delete(id: number): Observable<Response_String>{
    return this.http.delete<Response_String>(this.baseUrl + 'delete/' + id);
  }
  // --------------------------------update seance method 
  update(seance: Seances) : Observable<Response_String>{
    return this.http.put<Response_String>(this.baseUrl+"update", seance);
  }
  
}

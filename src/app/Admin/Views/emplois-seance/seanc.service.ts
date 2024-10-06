import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Seances} from '../../Models/Seances';
import { Response_String } from '../../Models/Response_String';
import { Journee } from '../../Models/Configure_seance';
import { teacherConfigureDto } from '../../Models/Teachers';

@Injectable({
  providedIn: 'root'
})
export class SeancService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:8080/api-seance/'
  // -----------------------------get all seances by emplois id
  // getAllByEmploisId(id: number) : Observable<Seances[]>{
  //   return this.http.get<Seances[]>(this.baseUrl + 'list/' + id);
  // }
  getAllByEmploisId(id: number) : Observable<Journee[]>{
    return this.http.get<Journee[]>(this.baseUrl + 'list/' + id);
  }
  
  // ------------------------------add seance
  create(seance: Seances[]): Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl + 'add', seance);
  }
 
  add_journee(journee: Journee[]) : Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl+"add-journee", journee)
  }
  // ---------------------------------------delete seance 
  delete(id: number): Observable<Response_String>{
    return this.http.delete<Response_String>(this.baseUrl + 'delete/' + id);
  }
  // --------------------------------update seance method 
  update(seance: Seances) : Observable<Response_String>{
    return this.http.put<Response_String>(this.baseUrl+"update", seance);
  }

  getSeance_byId(idSeance: number) : Observable<any>{
    return this.http.get<any>(this.baseUrl+ "get-by-id/" +idSeance);
  }
 
  // ----------------------------add surveillance

  addSurveillance(surveillance: Journee[]) : Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl+"add-addSurveillance", surveillance);
  }
  
   // -----------------get teacher config
   get_teacher_configuration(idEmploi: number) : Observable<teacherConfigureDto[]>{
    return this.http.get<teacherConfigureDto[]>(this.baseUrl+"lit-teacher-config/"+idEmploi);
  }
}

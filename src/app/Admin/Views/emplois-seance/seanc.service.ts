import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Seances } from '../../Models/Seances';
import { Response_String } from '../../Models/Response_String';
import { Configure_seance } from '../../Models/Configure_seance';
import { Emplois } from '../../Models/Emplois';

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
  create(seance: Seances[]): Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl + 'add', seance);
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
  // ------------------------------add config seance
  addConfigureSeance(config : Configure_seance[]) : Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl+"add-config", config)
  }
  get_all_configSeance(idEmploi : number) : Observable<Configure_seance[]>{
    return this.http.get<Configure_seance[]>(this.baseUrl+"all-config-by-id-emploi/" + idEmploi)
  }
  
}

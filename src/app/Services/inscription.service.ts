import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Inscription } from '../Admin/Models/Students';
import { Observable } from 'rxjs';
import { Response_String } from '../Admin/Models/Response_String';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {

  private baseUrl = `${environment.apiUrl}api-subscribe/`
  constructor(private http: HttpClient) { }

   // -----------------------inscription by id classe
   getInscriptionsIdClasse(idAnnee: number, idClasse: number) : Observable<Inscription[]>{
    return this.http.get<Inscription[]>(`${this.baseUrl}subscribe-by-class-id/${idAnnee}/${idClasse}`);
  }
  // list inscription by id groupe
  getListInscriptionByIdGroup(idGroup: number) : Observable<Inscription[]>{
    return this.http.get<Inscription[]>(this.baseUrl+"list-subscribe-by-group-id/"+idGroup)
  }
  // list inscriptions by id emploi
  getListInscriptionByIdEmploi(idEmploi: number) : Observable<Inscription[]>{
    return this.http.get<Inscription[]>(this.baseUrl+"list-subscribe-by-emploi-id/"+idEmploi)
  }
  // annuler le depot
  annulerDepot(idInscription: number) : Observable<Response_String>{
    return this.http.get<Response_String>(this.baseUrl+"annuler-depot/"+idInscription)
  }

  // get inscription by id
  getInscriptionById(idInscription: number) : Observable<Inscription>{
    return this.http.get<Inscription>(this.baseUrl+"inscription-by-id/"+idInscription)
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Dto_scolarite, Inscription } from '../Admin/Models/Students';
import { finalize, Observable } from 'rxjs';
import { Response_String } from '../Admin/Models/Response_String';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {

  private baseUrl = `${environment.apiUrl}api-subscribe/`
  constructor(private http: HttpClient, private loadingService: LoaderService) { }

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

  singIn(student: Inscription, photoFile: File): Observable<Response_String> {
    this.loadingService.loading();
    const formData = new FormData();
    formData.append('inscription', JSON.stringify(student));
   
    formData.append('file', photoFile);
    //  console.log(formData.get('inscription'), formData.get('file'));
    return this.http.post<Response_String>(this.baseUrl + "add", formData).pipe(
      finalize(() => {
        // Arrêter le loader lorsque la requête est terminée
        this.loadingService.stopLoading(); 
      }),
    )
}

  // get scolarite
  getScolarite(idEtudiant: number) : Observable<Dto_scolarite>{
    return this.http.get<Dto_scolarite>(this.baseUrl+"get-scolarite-and-reliquat-by/"+ idEtudiant)
  }

  // get all inscrit of year
  getAllInscriptionsOfYear(idAnnee: number) : Observable<Inscription[]>{
    return this.http.get<Inscription[]>(this.baseUrl+"all-subscribe-by-annee/"+idAnnee)
  }
  // get all subscriptions by current year
  getInscriptionByCurrentYear() : Observable<Inscription[]>{
    return this.http.get<Inscription[]>(this.baseUrl +"all-subscribe-by-current-year");
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Dto_scolarite, Inscription, InscriptionNoteDto, paiement } from '../Admin/Models/Students';
import { finalize, Observable } from 'rxjs';
import { Response_String } from '../Admin/Models/Response_String';
import { LoaderService } from './loader.service';
import { AddNoteDto } from '../Admin/Models/Notes';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {

  private baseUrl = `${environment.apiUrl}api-subscribe/`
  constructor(private http: HttpClient, private loadingService: LoaderService) { }

   // inscription by id classe
   getInscriptionsIdClasse(idClasse: number) : Observable<Inscription[]>{
    return this.http.get<Inscription[]>(`${this.baseUrl}get-incrits-by-idClasse/${idClasse}`);
  }
  // list inscription by id groupe
  getListInscriptionByIdGroup(idGroup: number, idEmploi: number) : Observable<AddNoteDto[]>{
    return this.http.get<AddNoteDto[]>(`${this.baseUrl}list-subscribe-by-group-id/${idGroup}/${idEmploi}`)
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
  // add inScriptions to sous filieres
  addInscriptionsToSubfilieres(idInscrit: number, idSouFiliere: number): Observable<Response_String>{
    return this.http.get<Response_String>(`${this.baseUrl}add-inscit-to-sous-filiere/${idInscrit}/${idSouFiliere}`)
  }

  // get inscritptions by id sous filieres
  getInscriptionsByidSousFiliere(idSousFiliere: number) : Observable<any>{
    return this.http.get(`${this.baseUrl}get-inscriptions-by-filiere-specialite/${idSousFiliere}`)
  }

  // get all paiement 
  getAllPaiement(idInscrit: number) : Observable<paiement[]>{
    return this.http.get<paiement[]>(`${this.baseUrl}list-paiement-scolarite-by-idInscrit/${idInscrit}`)
  }

  // update paiement
  updatePaiement(idPaiement: number, scolarite: Dto_scolarite, idAdmin: number) : Observable<Response_String>{
    return this.http.put<Response_String>(`${this.baseUrl}update-paiement/${idPaiement}/${idAdmin}`, scolarite)
  }

  // get students statistic of current year
  getInscritStatistiquesOfCurrentYear(idAdmin: number) : Observable<any>{
    this.loadingService.loading()
    return this.http.get<any>(`${this.baseUrl}statistique-of-current-year/${idAdmin}`).pipe(
      finalize(() => this.loadingService.stopLoading())
    )
  }

  // get students statistic of year by idYear
  getInscritStatistiquesBYIdOfYear(idAnnee: number, idAdmin: number) : Observable<any>{
    this.loadingService.loading()
    return this.http.get<any>(`${this.baseUrl}statistique-by-id-annee/${idAnnee}/${idAdmin}`).pipe(
      finalize(() => this.loadingService.stopLoading())
    )
  }

  // get students inscrit by filiere and ispaye
  getInscriptionByFiliere(idFiliere: number, idAdmin: number, idAnnee: number, isPaye: boolean) : Observable<any>{
    this.loadingService.loading()
    return this.http.get<any>(`${this.baseUrl}inscriptions-by-filiere-and-ispaye/${idFiliere}/${idAdmin}/${idAnnee}/${isPaye}`).pipe(
      finalize(() => this.loadingService.stopLoading())
    )
  }

  // get students inscrit by status and ispaye
  getInscriptionByStatus(status: string, idAdmin: number, idAnnee: number, isPaye: number) : Observable<any>{
    this.loadingService.loading()
    return this.http.get<any>(`${this.baseUrl}inscriptions-by-status-and-ispaye/${status}/${idAdmin}/${idAnnee}/${isPaye}`).pipe(
      finalize(() => this.loadingService.stopLoading())
    )
  }

}

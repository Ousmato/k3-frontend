import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AnneeScolaire } from '../../../Admin/Models/School-info';
import { finalize, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from '../../../Services/loader.service';
import { httpResponse } from '../models/httpResponse.model';
import { errorMessage } from '../utils/errorMessage';

@Injectable({
  providedIn: 'root'
})
export class PromotionServiceService {
  constructor(private http: HttpClient, private loading: LoaderService) { }

  private baseUrl = `${environment.apiUrl}Auth/` // Replace with your API URL

  // -------------------------------get all annee scolaire
  getAll_annee(): Observable<AnneeScolaire[]> {
    return this.http.get<AnneeScolaire[]>(this.baseUrl + "get-all-annee");
  }
  // -----------------------------add annee scolaire
  addAnnee(annee: AnneeScolaire, idAdmin: number): Observable<httpResponse> {
    this.loading.loading()
    return this.http.post<httpResponse>(`${this.baseUrl}add-annee-scolaire/${idAdmin}`, annee).pipe(
      finalize(() => this.loading.stopLoading())
    );
  }
  // ----------------update annee
  updateAnnee(annee: AnneeScolaire): Observable<httpResponse> {
    return this.http.put<httpResponse>(this.baseUrl + "updat-anne-scolaire", annee);
  }

   // ------------------delete by idAnnee
    deleteAnnee(idAnnee: number) : Observable<httpResponse>{
      return this.http.delete<httpResponse>(`${this.baseUrl}delete-annee-scolaire/${idAnnee}`);
    }
}

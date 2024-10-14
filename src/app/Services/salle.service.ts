import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Salles } from '../Admin/Models/Salles';
import { Response_String } from '../Admin/Models/Response_String';
import { teacherConfigureDto } from '../Admin/Models/Teachers';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalleService {

  private baseUrl = `${environment.apiUrl}api-salle/`
  constructor(private http: HttpClient) { }

  getAll() : Observable<Salles[]>{
    return this.http.get<Salles[]>(this.baseUrl+"list-all-salle")
  }
  getAll_non_occuper() : Observable<Salles[]>{
    return this.http.get<Salles[]>(this.baseUrl+"list-salle-non-occuper")
  }
  // --------------add salle

  add_salle(salle: Salles) : Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl+"add", salle);
  }

  // -----------------------get salles occuper
  getSallesOccuper() : Observable<Salles[]>{
    return this.http.get<Salles[]>(this.baseUrl+"all-salles-ocuper");
  } 

  // ------------------------------get nombre de salle non occuper
  getNombreSalleNonOccupe(): Observable<number>{
    return this.http.get<number>(this.baseUrl+"number-salle-non-occupe")
  }
  // ------------------------------get nombre de salle occuper
  getNombreSalleOccupe(): Observable<number>{
    return this.http.get<number>(this.baseUrl+"number-salle-occupe")
  }
  // --------------get salle by nom
  getSalleByNom(searchTream: string) : Observable<Salles>{
    return this.http.post<Salles>(this.baseUrl + "get-salle-by-nom", searchTream);
  }

 
}

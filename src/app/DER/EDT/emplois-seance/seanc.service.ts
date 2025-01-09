import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { Seances} from '../../../Admin/Models/Seances';
import { Response_String } from '../../../Admin/Models/Response_String';
import { Journee } from '../../../Admin/Models/Configure_seance';
import { teacherConfigureDto } from '../../../Admin/Models/Teachers';
import { environment } from '../../../../environments/environment';
import { LoaderService } from '../../../Services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class SeancService {

  constructor(private http: HttpClient, private loadService: LoaderService) { }
  private baseUrl = `${environment.apiUrl}api-seance/`
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
    this.loadService.loading();
    return this.http.post<Response_String>(this.baseUrl+"add-journee", journee).pipe(
      finalize(() =>this.loadService.stopLoading())
    );
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
    this.loadService.loading();
    return this.http.post<Response_String>(this.baseUrl+"add-addSurveillance", surveillance).pipe(
      finalize(() =>this.loadService.stopLoading())
    );
  }
  
   // -----------------get teacher config
   get_teacher_configuration(idEmploi: number) : Observable<teacherConfigureDto[]>{
    return this.http.get<teacherConfigureDto[]>(this.baseUrl+"lit-teacher-config/"+idEmploi);
  }
}

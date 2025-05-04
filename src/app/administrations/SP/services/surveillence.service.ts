import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { surveillants } from '../models/surveillence';
import { httpResponse } from '../../shared/models/httpResponse.model';

@Injectable({
  providedIn: 'root'
})
export class SurveillenceService {

  private baseUrl = `${environment.apiUrl}api-surveillence/`
  constructor(private http: HttpClient) { }

  getAllSurveillants() :Observable<surveillants[]>{
    return this.http.get<surveillants[]>(`${this.baseUrl}get-all-surveillants`);
  }

  addSurveillants(surveillant : surveillants) : Observable<httpResponse>{
    return this.http.post<httpResponse>(`${this.baseUrl}add-surveillant`, surveillant);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoaderService } from './loader.service';
import { environment } from '../../environments/environment';
import { Response_String } from '../Admin/Models/Response_String';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UeService {

  private baseUrl= `${environment.apiUrl}ue-api/`
  constructor(private http: HttpClient, private loadService: LoaderService) { }

  updateModuleVolHoraire(values: any) : Observable<Response_String>{
    return this.http.post<Response_String>(`${this.baseUrl}update-module-vol-horaire`, values)

  }
}

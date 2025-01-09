import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoaderService } from './loader.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response_String } from '../Admin/Models/Response_String';

@Injectable({
  providedIn: 'root'
})
export class StudentSessionService {

  private baseUrl = `${environment.apiUrl}session-api/`

  constructor(private http: HttpClient, private loaderService: LoaderService) { }

  addSessionNote(idInscription: number, idSemestre: number, idModule: number,note: number) : Observable<Response_String>{
    return this.http.post<Response_String>(`${this.baseUrl}add-session/${idInscription}/${idSemestre}/${idModule}`,note)
  }
}

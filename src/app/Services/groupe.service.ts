import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoaderService } from './loader.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Participant, StudentGroupDto } from '../Admin/Models/Students';

@Injectable({
  providedIn: 'root'
})
export class GroupeService {

  private baseUrl =`${environment.apiUrl}groupe-api/`
  constructor(private http: HttpClient, private loaderService: LoaderService) { }

  getAllGroupOfClasse(idClasse: number) : Observable<StudentGroupDto[]>{
    return this.http.get<StudentGroupDto[]>(`${this.baseUrl}get-all-groupes-of-classe/${idClasse}`);
  }

  // get all participants of class
  getAllParticipantsOfClasse(idClasse: number) : Observable<Participant[]>{
    return this.http.get<Participant[]>(`${this.baseUrl}get-all-participants-of-classe/${idClasse}`);
  }

  // get participants of group
  getParticipantsOfGroup(idGroup: number, idEmploi: number) : Observable<StudentGroupDto>{
    return this.http.get<StudentGroupDto>(`${this.baseUrl}get-participants-of-group/${idGroup}/${idEmploi}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Filiere, filiereSpecialite, Specialites } from '../Admin/Models/Filieres';
import { finalize, Observable } from 'rxjs';
import { Response_String } from '../Admin/Models/Response_String';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class SpecialiteService {

  private baseUrl = `${environment.apiUrl}api-teacher/`
  constructor(private http: HttpClient, private loaderService: LoaderService) { }

   // get all specialites
   getAllSpecialites(): Observable<Specialites[]>{
    return this.http.get<Specialites[]>(this.baseUrl+"get-all-specialites")
  }
   // get all specialites
   getAllSpecialitesNotAssociatedInTeacherById(idTeacher: number): Observable<Specialites[]>{
    return this.http.get<Specialites[]>(this.baseUrl+"get-all-specialites-by-idTeacher/"+ idTeacher)
  }

  // addspecialite
  addSpecialite(specialite: Specialites, filieres: Filiere[]): Observable<Response_String>{
    this.loaderService.loading();
    return this.http.post<Response_String>(this.baseUrl+"add-specialite/", {specialite , filieres}).pipe(
      finalize(() => this.loaderService.stopLoading())
    )
  }

  // get filiere specialite
  getFiliereSpecialite(): Observable<filiereSpecialite[]>{
    return this.http.get<filiereSpecialite[]>(this.baseUrl+"get-filiere-specialite/")
  }
  // update specialite
  updateSpecialite(specialite: Specialites): Observable<Response_String>{
    return this.http.put<Response_String>(this.baseUrl+"update-specialite/", specialite);
  }

  // add teacher specialite
  addTeacherSpecialite(idTeacher: number, specialite: Specialites[]): Observable<Response_String>{
    this.loaderService.loading();
    return this.http.post<Response_String>(`${this.baseUrl}add-teacher-specialite/${idTeacher}/`, specialite).pipe(
      finalize(() => this.loaderService.stopLoading())
    )
  }
}

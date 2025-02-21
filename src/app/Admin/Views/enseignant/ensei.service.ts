import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { Teacher, TeacherDto } from '../../Models/Teachers';
import { Response_String } from '../../Models/Response_String';
import { TeacherPages } from '../../Models/Pagination-module';
import { environment } from '../../../../environments/environment';
import { LoaderService } from '../../../Services/loader.service';


@Injectable({
  providedIn: 'root'
})
export class EnseiService {

  constructor(private http: HttpClient, private loadingService: LoaderService) { }
  private baseUrl = `${environment.apiUrl}api-teacher/`;

  // -----------------------------get all enseignants
  getAll(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.baseUrl + 'list-all');
  }

  // -----------------------------add enseignant
  create(teacher: Teacher): Observable<Response_String> {
    // const formData = new FormData();
    // formData.append('teacher', JSON.stringify(teacher));
    // formData.append('file', photo!);
    this.loadingService.loading();
    return this.http.post<Response_String>(this.baseUrl + 'add', teacher).pipe(
      finalize(() => this.loadingService.stopLoading())
    );

  }

 
  // --------------------------------add paie
  getAll_Teacher_By_IdUe(idFiliere: number): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.baseUrl + "list-teacher-by-filiere/" + idFiliere);
  }
  
 
  // -------------------------------------------update teacher
  updateTeacher(teacher: Teacher): Observable<Response_String> {

    return this.http.put<Response_String>(this.baseUrl + 'update', teacher);
  }
  // -----------------------get teacher by id
  getTeacher_by_id(idTeacher: number): Observable<Teacher> {
    return this.http.get<Teacher>(this.baseUrl + "teacher-by-id/" + idTeacher)
  }
  // ----------------------------------lad teacher by pagination
  getTeachers(page: number, size: number): Observable<TeacherPages> {
    return this.http.get<TeacherPages>(`${this.baseUrl}all-techer-by-with-profile?page=${page}&size=${size}`);
  }
  
 

  // ---------------------------get nombre enseignant
  countTeacherNumber(): Observable<number> {
    return this.http.get<number>(this.baseUrl + "count-teacher-number")
  }
  // ------------------------get filtered teachers 
  getFilteredTeachers(searchTerm: number): Observable<Teacher> {
    return this.http.post<Teacher>(this.baseUrl + "teachers-filtered", searchTerm);
  }
  getListFilteredTeachers(searchTerm: string): Observable<Teacher[]> {
    return this.http.post<Teacher[]>(this.baseUrl + "teachers-filtered-list", searchTerm);
  }


  addTeacher(teachers: Teacher[], idAdmin: number) : Observable<Response_String> {
    this.loadingService.loading();
    return this.http.post<Response_String>(this.baseUrl+"add-teachers-import/"+idAdmin, teachers).pipe(
      finalize(() => this.loadingService.stopLoading())
    )
  }

  
  getAllEmploiOfTeacherOfCurrentYear(idTeacher: number): Observable<TeacherDto>{
    return this.http.get<TeacherDto>(`${this.baseUrl}all-emplois-of-teacher-of-current-year/${idTeacher}`);
  }

  // all emploi of teacher by id year
  getAllEmploiOfTeacherByIdYear(idAnnee: number, idTeacher: number) : Observable<TeacherDto>{
    return this.http.get<TeacherDto>(`${this.baseUrl}all-emplois-of-teacher/${idAnnee}/${idTeacher}`);
  }
  // desable teacher 
  desableTeacher(idTeacher: number): Observable<Response_String> {
    return this.http.put<Response_String>(`${this.baseUrl}desable-teacher/${idTeacher}`, null);
  }
 
 
}

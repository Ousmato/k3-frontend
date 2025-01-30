import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { Inscription, montantsCount, Participant, Student, Student_count, Student_group, Student_import, Student_reinscription } from '../../Models/Students';
import { GetNoteDto, NoteDto, Notes } from '../../Models/Notes';
import { Module } from '../../Models/Module';
import { Response_String } from '../../Models/Response_String';
import { Doc_Pages, NotesPages, StudentPages } from '../../Models/Pagination-module';
import { Docum, Jury, ProgramSoutenance, Soutenance, StudentDoc } from '../../Models/doc';
import { environment } from '../../../../environments/environment';
import { LoaderService } from '../../../Services/loader.service';
import { SharedMethodes } from '../../../R-SCOLARITE/Utils/SharedMethodes';

@Injectable({
  providedIn: 'root'
})
export class EtudeService {

  constructor(private http: HttpClient, private loadingService: LoaderService) { }

  private baseUrl = `${environment.apiUrl}api-student/`;
  private baseUrl_note = `${environment.apiUrl}api-note/`;
  getAll() : Observable<Student[]>{
    return this.http.get<Student[]>(this.baseUrl+"find-all");
  }

  // -----------------------------add doc(memoire/rapport)
  addDoc(doc: StudentDoc) : Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl+"add-doc" , doc);
  }
// --------------------add studens import excel file 
addStudentImport(studentImport: Inscription[]) : Observable<Response_String>{
  console.log(studentImport.length, "studentImport nombre dans le service")
  // studentImport.forEach(sti =>sti.date = new Date(sti.date!));
  this.loadingService.loading();
  return this.http.post<Response_String>(this.baseUrl+"students-import", studentImport).pipe(
    finalize(() => this.loadingService.stopLoading())
  );
}
  // ---------------------------get all docs(memoir/rapport)
  getAllDoc() : Observable<Docum[]>{
    return this.http.get<Docum[]>(this.baseUrl+"all-doc");
  }

  // ---------------------------all doc of classe
  getAllDocByClasse(idClasse: number) : Observable<StudentDoc[]>{
    return this.http.get<StudentDoc[]>(this.baseUrl+"all-docs-by-idClasse/" + idClasse);
  }
  // ----------------------get all docs by idAnnee
  getAnneeByIdClasseAndAnnee(page: number, size: number, idAnnee : number) : Observable<Doc_Pages>{
    return this.http.get<Doc_Pages>(`${this.baseUrl}all-docs-by-idAnnee/${idAnnee}?page=${page}&${size}`)
  }

  // --------------------------------get current year docs
  getCurrentYearDoc(page: number, size: number,) : Observable<Doc_Pages>{
    return this.http.get<Doc_Pages>(`${this.baseUrl}default-docs-curent-year?page=${page}&size=${size}`)
  }
  // ----------------------get all student by idclasse
  
  // getStudentByIdClasse(idClasse: number) : Observable<Student[]>{
  //   return this.http.get<Student[]>(this.baseUrl + "student-by-classe-id/" + idClasse);
  // }
 

  getStudent_ByIdClasse(page: number, size: number, idClasse: number): Observable<StudentPages> {
    return this.http.get<StudentPages>(`${this.baseUrl}list-student-by-classe/${idClasse}?page=${page}&size=${size}`);
  }
  
  

   // -----------------------------------get all module filter
   getAllModulesWithoutNoteFilter(idStudent: number, idClass: number, idSemestre: number): Observable<Module[]> {
    console.log("student ", idStudent, "class", idClass, "semestre", idSemestre)
    return this.http.get<Module[]>(`${this.baseUrl_note}all-Modules-filter/${idStudent}/${idClass}/${idSemestre}`);
   
  }
  // -------------------get note of student in current semestre
   getAllNoteByIdStudent(id: number, idSemestre: number): Observable<GetNoteDto[]> {
    return this.http.get<GetNoteDto[]>(this.baseUrl_note + "all-note-and-moyen/" +id+"/"+ idSemestre);
   
  }
  // -----------------------------------------desactive student by id
  desactiveStudent(id: number): Observable<Response_String>{
    return this.http.get<Response_String>(this.baseUrl + "desable/" + id);
  }
  // ---------------------update student
  updateStudent(student: Inscription, file?: File): Observable<Response_String> {
    const formData = new FormData();
    formData.append('student', JSON.stringify(student));
    formData.append('file', file!);
    return this.http.put<Response_String>(this.baseUrl + 'update', formData);
  }
  reInscriptionStudent(students: number[], idClasse: number, idAdmin: number): Observable<Response_String> {
    const url = `${this.baseUrl}re-inscription/${idClasse}/${idAdmin}`;
    this.loadingService.loading()
    return this.http.post<Response_String>(url, students).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
}
  // -----------------------update scolarite
  update_student_scolarite(idInscription: number, idAdmin: number, scolarite: number): Observable<Response_String> {
    const url = `${this.baseUrl}update-scolarite/${idInscription}/${idAdmin}`;
    return this.http.put<Response_String>(url, { scolarite });
  }
  // ----------------------------------lad teacher by pagination
  getSudents(page: number, size: number): Observable<StudentPages> {
    console.log(size, "les sizes chercher")
    this.loadingService.loading()
    return this.http.get<StudentPages>(`${this.baseUrl}list?page=${page}&size=${size}`).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  }
  // -----------------------get all student by id annee scolaire

  getAll_by_idAnnee(idAnnee: number, page: number, size: number): Observable<StudentPages> {
    return this.http.get<StudentPages>(`${this.baseUrl}student-by-anneScolaire-id/${idAnnee}?page=${page}&size=${size}`);
  }
  // ----------------------------------update note
  update_note(note: Notes) : Observable<Response_String>{
    return this.http.put<Response_String>(this.baseUrl_note+"update-note", note);
  }
  // ---------------------------------add groupe 
  addGroup(name: string, idEmploi: number) : Observable<Response_String>{
    return this.http.post<Response_String>(`${this.baseUrl}add-group/${idEmploi}`, name);
  }
  // -------------------------get all group
  getAllGroup() : Observable<Student_group[]>{
    return this.http.get<Student_group[]>(this.baseUrl+"find-all-groupe");
  }

  getListGroupByIdEmploi(idEmploi: number) : Observable<Student_group[]>{
    return this.http.get<Student_group[]>(this.baseUrl+"list-group-by-idEmploi/"+idEmploi)
  }
  getListStudentsByIdGroup(idGroup: number) : Observable<Student[]>{
    return this.http.get<Student[]>(this.baseUrl+"list-students-by-group-id/"+idGroup)
  }
  // ----------------add participant
  addParticipant(participants: Participant[]) : Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl+"add-more-participant", participants);
  }

  // ---------------------get all participants by emploi id
  getParticipantsByEmploiId(idEmploi: number) : Observable<Participant[]>{
    return this.http.get<Participant[]>(this.baseUrl+"list-participant-by-class-id/"+idEmploi);
  }
 
  // ------------------get sum of reliquat of current year
  getmontants() : Observable<montantsCount>{
    return this.http.get<montantsCount>(this.baseUrl+"montants-cunt");
  }
  // ----------------get student number inscrit and non inscrit
  getStudentNumber() : Observable<Student_count>{
    return this.http.get<Student_count>(this.baseUrl+"student-count");
  }
  // --------------programmer soutenance
  createSoutenance(programmer: ProgramSoutenance) : Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl+"add-soutenance", programmer);
  }
  // ---------------------get all soutenance actif
  getAllSoutenanceActif(): Observable<Soutenance[]>{
    return this.http.get<Soutenance[]>(this.baseUrl +"all-soutenance-actif")
  }

  // --------------------memoire number
  getMemoireNumber() : Observable<number>{
    return this.http.get<number>(this.baseUrl+"memoire-number");
  }
  // ----------------------rapport stage number
  getRapportNumber() : Observable<number>{
    return this.http.get<number>(this.baseUrl+"rapport-number");
  }
  // ----------------------get page student by id annee and id classe
  getStudentPageByIdAnneeAndIdClasse(idAnnee: number, idClass: number, page: number, size: number): Observable<StudentPages> {
    return this.http.get<StudentPages>(`${this.baseUrl}get-student-annee-and-classe/${idAnnee}/${idClass}?page=${page}&size=${size}`);
  }

  getStudentListByIdAnneeAndIdClasse(idAnnee: number, idClass: number) : Observable<Inscription[]>{
    return this.http.get<Inscription[]>(`${this.baseUrl}get-list-student-by-idAnnee-and-idClasse/${idAnnee}/${idClass}`)
  }
  // -----------------------annuler le programme de soutenance
  annulerProgramme(idDoc: number):Observable<boolean>{
    return this.http.get<boolean>(this.baseUrl+"desaprouve-doc/"+idDoc)
  }

  // ------------------ajouter soutenance note
  addSoutenanceNote(idDoc: number, note: number) : Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl+"add-soutenance-note/"+idDoc, note);
  }
  // -------------------------get student by etats
  getByEtat(value: number, page: number, size: number): Observable<StudentPages> {
    this.loadingService.loading()
    return this.http.get<StudentPages>(`${this.baseUrl}get-student-by-etats/${value}?page=${page}&size=${size}`).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  }
  // -----------change state inscription
  changeStateStudentInscription(idInscription: number, idClasse: number): Observable<Response_String>{
    return this.http.get<Response_String>(`${this.baseUrl}change-state-inscription/${idInscription}/${idClasse}`)
  }
}

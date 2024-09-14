import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Participant, Student, Student_count, Student_group, Student_reinscription } from '../../Models/Students';
import { Notes } from '../../Models/Notes';
import { Module } from '../../Models/Module';
import { Response_String } from '../../Models/Response_String';
import { Doc_Pages, NotesPages, StudentPages } from '../../Models/Pagination-module';
import { Docum, Soutenance, StudentDoc } from '../../Models/doc';

@Injectable({
  providedIn: 'root'
})
export class EtudeService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:8080/api-student/'
  private baseUrl_note = 'http://localhost:8080/api-note/'
  getAll() : Observable<Student[]>{
    return this.http.get<Student[]>(this.baseUrl+"find-all");
  }

  // -----------------------------add doc(memoire/rapport)
  addDoc(doc: StudentDoc) : Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl+"add-doc" , doc);
  }

  // ---------------------------get all docs(memoir/rapport)
  getAllDoc() : Observable<Docum[]>{
    return this.http.get<Docum[]>(this.baseUrl+"all-doc");
  }

  // ---------------------------all doc of classe
  getAllDocByClasse(idClasse: number) : Observable<StudentDoc[]>{
    return this.http.get<StudentDoc[]>(this.baseUrl+"all-docs-by-idClasse/" + idClasse);
  }
  // ----------------------get all docs by idClasse and idAnnee
  getAnneeByIdClasseAndAnnee(page: number, size: number, idAnnee : number) : Observable<Doc_Pages>{
    return this.http.get<Doc_Pages>(`${this.baseUrl}all-docs-by-idClass-and-idAnnee/${idAnnee}?page=${page}&${size}`)
  }

  // --------------------------------get current year docs
  getCurrentYearDoc(page: number, size: number,) : Observable<Doc_Pages>{
    return this.http.get<Doc_Pages>(`${this.baseUrl}default-docs-curent-year?page=${page}&size=${size}`)
  }
  // ----------------------get all student by idclasse
  
  getStudentByIdClasse(idClasse: number) : Observable<Student[]>{
    return this.http.get<Student[]>(this.baseUrl + "student-by-classe-id/" + idClasse);
  }

  getStudent_ByIdClasse(page: number, size: number, idClasse: number): Observable<StudentPages> {
    return this.http.get<StudentPages>(`${this.baseUrl}list-student-by-classe/${idClasse}?page=${page}&size=${size}`);
  }
  
  // ------------------------add note
  add_note(note: Notes) : Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl_note+"add-note", note);
  }

   // -----------------------------------get all module filter
   getAllModulesWithoutNoteFilter(id: number, idClass: number): Observable<Module[]> {
    return this.http.get<Module[]>(this.baseUrl_note + "all-Modules-filter/" +id+"/"+ idClass);
   
  }
  // -------------------get note of student in current semestre
   getAllNoteByIdStudent(id: number, idSemestre: number): Observable<Notes[]> {
    return this.http.get<Notes[]>(this.baseUrl_note + "read/" +id+"/"+ idSemestre);
   
  }
  // ----------------------------------get all note of classe
  // read-all-of-semestre/
  getAllNoteByClasse(page: number, size: number, idClasse: number): Observable<NotesPages> {
    return this.http.get<NotesPages>(`${this.baseUrl_note}read-all-of-semestre/${idClasse}?page=${page}&size=${size}`);
  }
  // -----------------------------------------desactive student by id
  desactiveStudent(id: number): Observable<Response_String>{
    return this.http.get<Response_String>(this.baseUrl + "desable/" + id);
  }
  // ------------------------get stuudent by id
  getStudent_by_id(idStudent: number) : Observable<Student>{
    return this.http.get<Student>(this.baseUrl+"student-by-id/"+idStudent)
  }
  // ---------------------update student
  updateStudent(student: Student, file?: File): Observable<Response_String> {
    const formData = new FormData();
    formData.append('student', JSON.stringify(student));
    formData.append('file', file!);
    return this.http.put<Response_String>(this.baseUrl + 'update', formData);
  }
  reInscriptionStudent(idStudent: number, idClasse: number, idAnne: number): Observable<Response_String> {
    
    return this.http.get<Response_String>(`${this.baseUrl}re-inscription/${idStudent}/${idClasse}/${idAnne}`);
  }
  // -----------------------update scolarite
  update_student_scolarite(idEtudiant: number, scolarite: number): Observable<Response_String> {
    const url = `${this.baseUrl}update-scolarite/${idEtudiant}`;
    return this.http.put<Response_String>(url, { scolarite });
  }
  // ----------------------------------lad teacher by pagination
  getSudents(page: number, size: number): Observable<StudentPages> {
    return this.http.get<StudentPages>(`${this.baseUrl}list?page=${page}&size=${size}`);
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
  addGroup(group: Student_group) : Observable<Response_String>{
    return this.http.post<Response_String>(this.baseUrl+"add-group", group);
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
  getParticipantsByEmploiId(idClass: number) : Observable<Participant[]>{
    return this.http.get<Participant[]>(this.baseUrl+"list-participant-by-class-id/"+idClass);
  }
  // -----------------get sum scolarite of current year
  getScolarite_annee_courante() : Observable<number>{
    return this.http.get<number>(this.baseUrl+"sum-scolarite");
  }
  // ------------------get sum of reliquat of current year
  getReliquat_annee_courante() : Observable<number>{
    return this.http.get<number>(this.baseUrl+"sum-reliquat");
  }
  // ----------------get student number inscrit and non inscrit
  getStudentNumber() : Observable<Student_count>{
    return this.http.get<Student_count>(this.baseUrl+"student-count");
  }
  // --------------programmer soutenance
  createSoutenance(programmer: Soutenance) : Observable<Response_String>{
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
  // ----------------------get student by id annee and id classe
  getStudentByIdAnneeAndIdClasse(idAnnee: number, idClass: number, page: number, size: number): Observable<StudentPages> {
    return this.http.get<StudentPages>(`${this.baseUrl}get-student-annee-and-classe/${idAnnee}/${idClass}?page=${page}&size=${size}`);
  }

}

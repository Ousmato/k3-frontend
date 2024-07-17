import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Emplois } from '../../Models/Emplois';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:8080/api-emplois/';

  // -------------------------------add emplois
  addEmplois(emplois: Emplois): Observable<any>{
    return this.http.post(`${this.baseUrl}add`, emplois);
  }
  // -----------------------------------------------------------get emplois by id
  getEmploisById(id: number): Observable<Emplois>{
    return this.http.get<Emplois>(`${this.baseUrl}emplois/${id}`);
  }
  // --------------------------------------get by id classe
  getEmploisByClasse(id: number): Observable<Emplois[]>{
    return this.http.get<Emplois[]>(`${this.baseUrl}read/${id}`);
  }
  getEmploisByClasse2(id: number): Observable<Emplois>{
    return this.http.get<Emplois>(`${this.baseUrl}read/${id}`);
  }
   // Méthode pour vérifier si une classe a un emploi du temps actif
   hasActiveEmploisByClasse(classId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}hasEmplois/${classId}`);
  }
  // ----------------------------validate emplois
  validateEmplois(idEmplois: number) : Observable<any>{
    return this.http.get<any>(`${this.baseUrl}valid/${idEmplois}`);
  }
  // ---------------------------method to verifier emplois is valid
  isEmploisValid(idEmplois: number): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}is-valid/${idEmplois}`);
  }
  // ------------------------------------calcule dates and get list dates between dateDebut and dateFin
  getDaysBetweenDatesTest(dateDebut: Date, dateFin: Date): { day: string, dates: string[] }[] {
    const sDate = new Date(dateDebut);
    const eDate = new Date(dateFin);
    const diff = Math.round((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24));
    const dayMap = ["Dimache", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const dates: { day: string, dates: string[] }[] = [];

    for (let i = 0; i <= diff; i++) {
      // Exclure le dimanche
      if (sDate.getDay() !== 0) {
        let index = dates.findIndex( e => e.day == dayMap[sDate.getDay()])
        if(index > -1){
          dates[index].dates.push(sDate.toISOString().split('T')[0])
        }else{
          dates.push({
            day: dayMap[sDate.getDay()],
            dates: [sDate.toISOString().split('T')[0]] // Format YYYY-MM-DD
          });
        }
      }
      sDate.setDate(sDate.getDate() + 1);
  }
     // Reorder dates to start from Monday and end on Sunday
     while (dates.length && dates[0].day !== "Lundi") {
      dates.push(dates.shift()!);
  }
    return dates;
  }
  getDaysBetweenDates(dateDebut: Date, dateFin: Date): { day: string, date: string }[] {
    const sDate = new Date(dateDebut);
    const eDate = new Date(dateFin);
    const diff = Math.round((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24));
    const dayMap = ["Dimache", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const dates: { day: string, date: string }[] = [];

    for (let i = 0; i <= diff; i++) {
      // Exclure le dimanche
      if (sDate.getDay() !== 0) {
          dates.push({
              day: dayMap[sDate.getDay()],
              date: sDate.toISOString().split('T')[0] // Format YYYY-MM-DD
          });
      }
      sDate.setDate(sDate.getDate() + 1);
  }
     // Reorder dates to start from Monday and end on Sunday
     while (dates.length && dates[0].day !== "Lundi") {
      dates.push(dates.shift()!);
  }
    return dates;
  }
  // ----------------------------------------grt all emplois actifs
  getAllEmploisActifs(): Observable<Emplois[]>{
    return this.http.get<Emplois[]>(`${this.baseUrl}all-actifs-emplois`);
  }
  // ------------------------get all emplois by id
 
}


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DtoWeek_Emplois, Emplois, TeacherEmplois } from '../../../administrations/DER/models/Emplois';
import { finalize, Observable } from 'rxjs';
import { Response_String } from '../../../Admin/Models/Response_String';
import { environment } from '../../../../environments/environment';
import { httpResponse } from '../../../administrations/shared/models/httpResponse.model';
import { LoaderService } from '../../../Services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient, private loading: LoaderService) { }
  private baseUrl = `${environment.apiUrl}api-emplois/`;

  // -------------------------------add emplois
  addEmplois(emplois: Emplois): Observable<Response_String>{
    return this.http.post<Response_String>(`${this.baseUrl}add`, emplois);
  }
  // -----------------------------------------------------------get emplois by id
  getEmploisById(id: number): Observable<Emplois>{
    return this.http.get<Emplois>(`${this.baseUrl}emplois/${id}`);
  }
  // --------------------------------------get list emplois by id classe
  getEmploisByClasse(id: number): Observable<Emplois[]>{
    return this.http.get<Emplois[]>(`${this.baseUrl}read/${id}`);
  }
  // --------------------------get emplois by id class
  getEmploisByClasse2(id: number): Observable<Emplois>{
    return this.http.get<Emplois>(`${this.baseUrl}read/${id}`);
  }
 

  getDaysBetweenDates(dateDebut: Date, dateFin: Date): { day: string, date: string }[] {
    const sDate = new Date(dateDebut);
    const eDate = new Date(dateFin);
    const diff = Math.round((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24));
    const dayMap = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
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

    // Appel à la méthode sortByDay pour trier les dates par jour
    this.sortByDay(dates);
    console.log(dates, "; dates services");
    return dates;
}

// Nouvelle méthode sortByDay pour trier les jours de la semaine
sortByDay(dates: { day: string, date: string }[]) {
    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  
    // Trier les séances par jour en utilisant l'ordre défini dans daysOfWeek
    dates.sort((a, b) => {
        const dayIndexA = daysOfWeek.indexOf(a.day);
        const dayIndexB = daysOfWeek.indexOf(b.day);
        return dayIndexA - dayIndexB;
    });
}

  getDaysBetweenDatesAndDaysDate(dateDebut: Date, dateFin: Date): { day: string, date: string, dateDay?: string }[] {
    const sDate = new Date(dateDebut);
    const eDate = new Date(dateFin);
    const diff = Math.round((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24));
    const dayMap = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const dates: { day: string, date: string, dateDay?: string }[] = [];

    for (let i = 0; i <= diff; i++) {
        // Exclure le dimanche
        if (sDate.getDay() !== 0) {
            dates.push({
                day: dayMap[sDate.getDay()],
                date: sDate.toISOString().split('T')[0], // Format YYYY-MM-DD
                dateDay: `${dayMap[sDate.getDay()]} ${sDate.getDate()}` 
            });
        }
        sDate.setDate(sDate.getDate() + 1);
    }

    // Réorganiser les dates pour commencer par lundi et finir par dimanche
    this.sortByDay(dates)
    
    return dates;
}

  // grt all emplois actifs
  getAllEmploisActifs(idAdmin: number): Observable<Emplois[]>{
    return this.http.get<Emplois[]>(`${this.baseUrl}all-actifs-emplois/${idAdmin}`);
  }

  getAllEmploisHaveJourneeOfWeek(value: string): Observable<any[]>{
    this.loading.loading()
    return this.http.get<any[]>(`${this.baseUrl}all-actifs-emplois-with-journee`,{params: { value }}).pipe(
      finalize(() => this.loading.stopLoading())
    );
  }

  getAllEmploisActifsByidClasse(idClasse: number): Observable<Emplois[]>{
    return this.http.get<Emplois[]>(`${this.baseUrl}all-actifs-emplois-of-classe/${idClasse}`);
  }
  getAllEmploisActifs_with_seances(): Observable<Emplois[]>{
    return this.http.get<Emplois[]>(`${this.baseUrl}all-actifs-emplois-with-seances-without-exam`);
  }
  //update emplois without seance
  updateEmplois(emplois: Emplois): Observable<httpResponse>{
    return this.http.put<httpResponse>(`${this.baseUrl}update`, emplois);
  }

}


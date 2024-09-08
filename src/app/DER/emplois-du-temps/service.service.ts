import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Emplois } from '../../Admin/Models/Emplois';
import { Observable } from 'rxjs';
import { Response_String } from '../../Admin/Models/Response_String';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:8080/api-emplois/';

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
  // getDaysBetweenDatesTest(dateDebut: Date, dateFin: Date): { day: string, dates: string[] }[] {
  //   const sDate = new Date(dateDebut);
  //   const eDate = new Date(dateFin);
  //   const diff = Math.round((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24));
  //   const dayMap = ["Dimache", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  //   const dates: { day: string, dates: string[] }[] = [];

  //   for (let i = 0; i <= diff; i++) {
  //     // Exclure le dimanche
  //     if (sDate.getDay() !== 0) {
  //       let index = dates.findIndex( e => e.day == dayMap[sDate.getDay()])
  //       if(index > -1){
  //         dates[index].dates.push(sDate.toISOString().split('T')[0])
  //       }else{
  //         dates.push({
  //           day: dayMap[sDate.getDay()],
  //           dates: [sDate.toISOString().split('T')[0]] // Format YYYY-MM-DD
  //         });
  //       }
  //     }
  //     sDate.setDate(sDate.getDate() + 1);
  // }
  //    // Reorder dates to start from Monday and end on Sunday
  //  this.sortByDay(dates)
  //   return dates;
  // }
  calculatePlage(heureDebut: string, heureFin: string): string[] {
    const plage: string[] = [];
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

    let debut = new Date(`${today}T${heureDebut}`);
    const fin = new Date(`${today}T${heureFin}`);
    while (debut < fin) {
        // Calculer la prochaine heure de début en ajoutant 2 heures
        const prochainHeureDebut = new Date(debut);
        prochainHeureDebut.setHours(prochainHeureDebut.getHours() + 2);

        // Si la prochaine heure de début dépasse l'heure de fin, ajuster à l'heure de fin
        if (prochainHeureDebut > fin) {
            prochainHeureDebut.setTime(fin.getTime());
        }

        // Ajouter la plage horaire au tableau
        plage.push(this.formatTime(debut) + " - " + this.formatTime(prochainHeureDebut));
        
        // Mettre à jour 'debut' pour la prochaine itération
        debut = prochainHeureDebut;
    }

    return plage;
}

// Méthode auxiliaire pour formater les heures en chaîne (HH:MM)
  private formatTime(date: Date): string {
      return date.toTimeString().substring(0, 5);
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

  // ----------------------------------------grt all emplois actifs
  getAllEmploisActifs(): Observable<Emplois[]>{
    return this.http.get<Emplois[]>(`${this.baseUrl}all-actifs-emplois`);
  }
  getAllEmploisActifs_with_seances(): Observable<Emplois[]>{
    return this.http.get<Emplois[]>(`${this.baseUrl}all-actifs-emplois-with-seances`);
  }
  // ------------------------update emplois without seance
  updateEmplois(emplois: Emplois): Observable<Response_String>{
    return this.http.put<Response_String>(`${this.baseUrl}update`, emplois);
  }
 
}


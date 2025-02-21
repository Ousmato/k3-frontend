import { Inject, Injectable } from "@angular/core";
import * as ExcelJS from 'exceljs';

@Injectable({
  providedIn: 'root', // Angular fournit une instance unique

})
export class Emploi_shared {
  formattedDate!: string;
  sortDay(datesWithDays: { day: string, date: string, dateDay?: string }[]) {
    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    // Trier les séances par jour en utilisant l'ordre défini dans daysOfWeek
    datesWithDays.sort((a, b) => {
      const dayIndexA = daysOfWeek.indexOf(a.day!);
      const dayIndexB = daysOfWeek.indexOf(b.day!);

      return dayIndexA - dayIndexB;
    });
  }

  // get month
  getMonth(): string {
    const date = new Date();
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    this.formattedDate = `${month}, ${year}`;

    return this.formattedDate;
  }

  getDayFromDate(date: string): string {
    const dateObject = new Date(date);

    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    // console.log(Intl.DateTimeFormat('fr-FR', options).format(dateObject))
    return new Intl.DateTimeFormat('fr-FR', options).format(dateObject);
  }

  formatTimeString(timeString: string | string[]): string {
    if (Array.isArray(timeString)) {
      // Si `timeString` est un tableau, traiter chaque élément individuellement
      return timeString.map(time => this.formatTimeString(time)).join(' - ');
    }

    // console.log(timeString.replace(/(\d{2})(:)/g, '$1H'), "plage hhhhhhhhhhhh")
    // Remplace les ":" par "H" pour le formatage en français
    return timeString.replace(/(\d{2})(:)/g, '$1H');
  }

  public gereateExcelRows(rowNumber: number, worksheet :ExcelJS.Worksheet){
    for (let i = 0; i < rowNumber; i++) {
      worksheet.addRow([]);
    }

  }
}
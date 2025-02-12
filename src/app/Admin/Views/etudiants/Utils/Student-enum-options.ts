import { Injectable } from "@angular/core";
import { Accademies, Diplome, Quartier, seriesType, Type_status } from "../../../Models/Students";

@Injectable({
    providedIn: 'root',
})
export class Student_Enum_Options {
     // get status options
      getStatusOptions(): { key: string, value: string }[] {
        return Object.keys(Type_status).map(key => ({
          key: key,
          value: Type_status[key as keyof typeof Type_status]
        }));
      }
      // get series options
      getSeriesOptions(): { key: string, value: string }[] {
        return Object.keys(seriesType).map(key => ({
          key: key,
          value: seriesType[key as keyof typeof seriesType]
        }));
      }
      // get accademies options
      getAccademiesOptions(): { key: string, value: string }[] {
        return Object.keys(Accademies).map(key => ({
          key: key,
          value: Accademies[key as keyof typeof Accademies]
        }));
      }
      // get diplomes options
      getDiplomesOptions(): { key: string, value: string }[] {
        return Object.keys(Diplome).map(key => ({
          key: key,
          value: Diplome[key as keyof typeof Diplome]
        }));
      }
      // get quartier options
      getQuartierOptions(): { key: string, value: string }[] {
        return Object.keys(Quartier).map(key => ({
          key: key,
          value: Quartier[key as keyof typeof Quartier]
        }));
      }
}
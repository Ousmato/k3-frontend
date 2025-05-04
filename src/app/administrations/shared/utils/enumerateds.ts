import { Injectable } from "@angular/core";
import { type_seance } from "../../DER/models/Seances";
import { RoleTypes } from "../models/Admin";

@Injectable({
    providedIn : "root"
})
export class Enumerateds {

    
  seanceTypeOptions: { key: string, value: string }[] = []

  getStatusOptions(): { key: string, value: string }[] {
    const options: { key: string, value: string }[] = Object.keys(type_seance).map(key => ({
      key,
      value: type_seance[key as keyof typeof type_seance]
    }));
  
    // Filtrer uniquement les types souhaités
    this.seanceTypeOptions = options.filter(o =>
      o.value === type_seance.SESSION || o.value === type_seance.Examen
    );
  
    return this.seanceTypeOptions;
  }

  getRoleTypeFilterOptions(): { key: string, value: string }[] {
    const options: { key: string, value: string }[] = Object.keys(RoleTypes).map(key => ({
      key,
      value: RoleTypes[key as keyof typeof RoleTypes]
    }));
  
    // Filtrer uniquement les types souhaités
    this.seanceTypeOptions = options.filter(o =>
      o.value === RoleTypes.ADMIN || o.value === RoleTypes.AUTRES
    );
  
    return this.seanceTypeOptions;
  }
  getEnumeratedKeyValue<T extends object>(enumClass: T): { key: string, value: string }[] {
    return Object.keys(enumClass)
      .filter(key => isNaN(Number(key))) // Filtrer les clés numériques (si l'énumération est bidirectionnelle)
      .map(key => ({
        key,
        value: (enumClass as any)[key]
      }));
  }

   static getEnumKeyByValue<T extends Record<string, string>>(enumObj: T, value: string): keyof T | undefined {
    return (Object.keys(enumObj) as (keyof T)[]).find(key => enumObj[key] === value);
  }


    
}
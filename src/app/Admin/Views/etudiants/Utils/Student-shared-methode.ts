import { Inject, Injectable } from "@angular/core";
import { Type_status } from "../../../Models/Students";
import { AnneeScolaire } from "../../../Models/School-info";

@Injectable({
    providedIn: 'root',
})
export class StudentSharedMethods{
    public statusMapper(status: string): string {
        switch (status) {
            case "REGULIER":
                return "REG"; // Abréviation
            case "CANDIDAT LIBRE":
                return "CL"; // Abréviation
            case "FORMATION CONTINUE":
                return "FC"; // Abréviation
            case "PROFESSIONNEL DE COLLECTIVITE":
                return "Pro. Collect"; // Abréviation
            case "PROFESSIONNEL ETAT":
                return "Pro. ETAT"; // Abréviation
            case "PROFESSIONNEL PRIVEE":
                return "Pro. Privé"; // Abréviation
            default:
                return status; // Cas où le statut ne correspond à rien
        }
    }
    

    
  public abreviateFiliereName(filiere: string): string {
    const nameWord = filiere.split(' ');
    const word = nameWord.filter(wd => wd.length > 3).map(word => word[0].toUpperCase()).join('')
    return word;
  }

  public extractAnnee(annee : AnneeScolaire) : number{
    const date = new Date(annee.debutAnnee);
    return date.getFullYear();
  }

  
}
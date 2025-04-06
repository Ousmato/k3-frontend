import { Injectable } from "@angular/core";
import { AnneeScolaire } from "../../../Admin/Models/School-info";

@Injectable({
    providedIn: 'root'
})
export class utils {
    public extractAnnee(annee: AnneeScolaire): number {
        const annee_ = new Date(annee.debutAnnee)
        return annee_.getFullYear()
    }

    public abrevigate(filiere: string): string {
        const nameWord = filiere.split(' ');
        const word = nameWord.filter(wd => wd.length > 3).map(word => word[0].toUpperCase()).join('')
        if(word === 'EER') return'3ER';
        if(word === 'A') return 'Admin';
        if(word === 'C') return 'COMPTABLE';
        return word;
      }
}
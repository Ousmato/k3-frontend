import { Injectable } from "@angular/core";
import { AnneeScolaire } from "../../../Admin/Models/School-info";

@Injectable({
  providedIn: 'root'
})
export class utils {
  IUFP: boolean = false
  FASSO: boolean = false
  FAGES: boolean = false
  FAMA: boolean = false
  public extractAnnee(annee: AnneeScolaire): number {
    const annee_ = new Date(annee.debutAnnee)
    return annee_.getFullYear()
  }

  public abrevigate(filiere: string): string {
    const nameWord = filiere.split(' ');
    const word = nameWord.filter(wd => wd.length > 3).map(word => word[0].toUpperCase()).join('')
    if (word === 'EER') return '3ER';
    if (word === 'A') return 'Admin';
    if (word === 'C') return 'COMPTABLE';
    if (word === 'S') return 'SECRETAIRE';
    return word;
  }
  public abrevigateNiveauName(name: string): string {
    if (name === 'LICENCE 1') return 'L1';
    if (name === 'LICENCE 2') return 'L2';
    if (name === 'LICENCE 3') return 'L3';
    return name;
  }

  facChange(event: any) {
    const value = event.target.value
    switch (value) {
      case "IUFP":
        this.IUFP = true
        this.FAGES = false
        this.FAMA = false
        this.FASSO = false

        break
      case "FAMA":
        this.FAMA = true
        this.IUFP = false
        this.FAGES = false
        this.FASSO = false
        break
      case "FAGES":
        this.FAGES = true
        this.IUFP = false
        this.FAMA = false
        this.FASSO = false
        break
      case "FASSO":
        this.FASSO = true
        this.IUFP = false
        this.FAGES = false
        this.FAMA = false
        break
    }
  }
}
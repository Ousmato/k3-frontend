import { Injectable } from "@angular/core";
import { AnneeScolaire } from "../../../Admin/Models/School-info";
import { Filiere } from "../../../Admin/Models/Filieres";
import { ClassRoom } from "../../../Admin/Models/Classe";
import { Niveau } from "../../../Admin/Models/Niveau";

@Injectable({
    providedIn: 'root'
})
export class Class_shared {
   
    public   abreviateFiliereName(nom: string): string {
        const wordAbreviate = nom.split(' ');
    
        let w = wordAbreviate.filter(w => w.length > 3).map(w => w[0].toUpperCase()).join('');
        switch (w) {
          case "T":
            w = "TO";
            break;
          case "H":
            w = "HO";
            break;
          case "D":
            w = "DEV";
            break;
          case "G":
            w = "GEN";
            break;
          case "A" :
            w = "Audit";
            break;
            case "EEER":
                w = "3ER"
                break;
    
        }
        return w;
    
      }

      public extractAnnee(annee: AnneeScolaire) : number{
        const annee_ = new Date(annee.debutAnnee)
        return annee_.getFullYear()
      }

      public filieres() : string[]{
        return ['Auccun','AB', 'AG', 'CFA', 'GI', 'HT', 'MA', 'MC' , '3ER']
      }

      public abrevigateNiveauName(Niv: string) : string{
        const name = Niv;
        let nameAbrev ;
        switch (name){
          case  "LICENCE 1":
            nameAbrev = "L1";
            break;
          case 'LICENCE 2': 
          nameAbrev = "L2";
          break;
          case 'LICENCE 3':
            nameAbrev = "L3";
            break;
         
          default:
        }
        return nameAbrev!;
      }

}
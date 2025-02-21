import { Injectable } from "@angular/core";
import { type_seance } from "../Models/Seances";

@Injectable({
    providedIn:`root`
})
export class EnumOptions {

    seanceTypeOptions: { key: string, value: string }[] = [];
    getStatusOptions() : { key: string, value: string }[]{
      // Réinitialiser seanceTypeOptions avant de l'utiliser pour stocker les nouveaux éléments
        this.seanceTypeOptions = [];
        
        const objet = Object.keys(type_seance).map(key => ({
            key: key,
            value: type_seance[key as keyof typeof type_seance]
        }));

        // Ajouter les éléments à seanceTypeOptions seulement si la valeur n'est pas SESSION ou Examen
        objet.forEach(o => {
            if (o.value !== type_seance.SESSION && o.value !== type_seance.Examen) {
            this.seanceTypeOptions.push(o);
            }
        });

        return this.seanceTypeOptions;
    }
}
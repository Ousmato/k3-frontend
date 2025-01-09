import { Injectable } from "@angular/core";
import { DatePipe } from '@angular/common';
@Injectable({
    providedIn: 'root', // Angular fournit une instance unique
  })
export class SharedMethodes {
    
   

    public mapStatus(status: string): string {
        switch (status.toLowerCase()) {
            case "pro. collect":
                return "PROFESSIONNEL_COLLECTIVITE";
            case "pro. etat":
                return "PROFESSIONNEL_ETAT";
            case "pro. privé":
                return "PROFESSIONNEL_PRIVEE";
            case "cl":
                return "CANDIDAT_LIBRE";
            case "reg":
                return "REGULIER";
            case "fc":
                return "FORMATION_CONTINUE";
            default:
                return status;
        }
    }

    // abrevigate 
   public abrevigateFiliereName(name: string) : string{
        const nameSplite = name.split(' ');
        return nameSplite.filter(word =>word.length > 3).map(w =>w[0].toUpperCase()).join('');
      }

      public dateTransform(dateString: string): string {
        // Dynamically parse the input string
        const dateParts = dateString.split(/[\s/:]+/); // Split by space, slash, or colon
        console.log(dateParts, "dateParts")
        if (dateParts.length < 3) {
            throw new Error("Invalid date format");
        }
    
        // Construct the Date object
        const date = new Date(
            Number(dateParts[2]), // Year
            Number(dateParts[1]) - 1, // Month (0-indexed)
            Number(dateParts[0]), // Day
            dateParts[3] ? Number(dateParts[3]) : 0, // Hour (optional)
            dateParts[4] ? Number(dateParts[4]) : 0, // Minute (optional)
            dateParts[5] ? Number(dateParts[5]) : 0  // Second (optional)
        );
    
        const datePipe = new DatePipe('fr-FR');
        const transformedDate = datePipe.transform(date, 'yyyy-MM-dd');

        console.log(transformedDate, "transformedDate")
        // Format the date dynamically for 'fr-FR'
        return transformedDate!
       

        
    }
    
    
}

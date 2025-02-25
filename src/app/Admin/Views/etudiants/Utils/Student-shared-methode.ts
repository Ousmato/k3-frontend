import { Inject, Injectable } from "@angular/core";
import { Student_group, Type_status } from "../../../Models/Students";
import { AnneeScolaire } from "../../../Models/School-info";

import jspdf, { jsPDF } from 'jspdf';  
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
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

  imprimer(group: Student_group) { 
    const buttonBack = document.getElementById('back') as HTMLElement;
    buttonBack.style.display = "none";
    const buttonContent = document.getElementById('idContent') as HTMLElement;
    buttonContent.style.display = "none";
    // const logo = document.getElementById('logo') as HTMLElement;
    var data = document.getElementById('idTable') as HTMLElement;
    if(data){
        // Save current styles to restore them later
        const originalPadding = data.style.padding;
        const originalHeight = data.style.height;
        const originalOverflow = data.style.overflow;
    
        // Temporarily set styles to capture the entire scrollable area
        data.style.padding = '50px'; 
        data.style.height = 'auto';
        data.style.fontSize = '12px';
        data.style.overflow = 'visible'; 
        // logo.style.display = 'block';
    
    
    
    // Id of the table
    html2canvas(data!, { scale: 2 }).then(canvas => {
        // Few necessary setting options
        let imgWidth = 297; // A4 landscape width in mm
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape
        let position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save(`liste-de-${group.nom}.pdf`);
        buttonBack.style.display = "block";
        buttonContent.style.display = "block";
        // logo.style.display = "none";
        data.style.padding = originalPadding;
        data.style.height = originalHeight;
        data.style.overflow = originalOverflow;
    });
  }
  } 

//export excel
exportExcel(group: Student_group) {
    // Cacher les éléments non pertinents pour l'export
    const buttonBack = document.getElementById('back') as HTMLElement;
    buttonBack.style.display = "none";
    const buttonContent = document.getElementById('idContent') as HTMLElement;
    buttonContent.style.display = "none";

    let data = document.getElementById('idTable') as HTMLElement;
    let headerContent = document.getElementById('idContent') as HTMLElement;

    // Créer un élément contenant le tout : table + autres sections
    let fullContent = document.createElement('div');
    fullContent.appendChild(headerContent.cloneNode(true)); // Clone l'entête (idContent)
    fullContent.appendChild(data.cloneNode(true)); // Clone la table (idTable)

    // Créer la feuille de calcul à partir du contenu HTML
    if (fullContent) {
        let ws = XLSX.utils.table_to_sheet(fullContent);

        // Appliquer les bordures à chaque cellule de la feuille
        let range = XLSX.utils.decode_range(ws['!ref'] as string);
        for (let row = range.s.r; row <= range.e.r; row++) {
            for (let col = range.s.c; col <= range.e.c; col++) {
                let cell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
                if (!cell) continue;

                // Définir les bordures (haut, bas, gauche, droite)
                cell.s = {
                    border: {
                        top: { style: 'solid', color: { rgb: "000000" } },
                        right: { style: 'solid', color: { rgb: "000000" } },
                        bottom: { style: 'solid', color: { rgb: "000000" } },
                        left: { style: 'solid', color: { rgb: "000000" } }
                    }
                };
            }
        }

        // Conserver les largeurs des colonnes
        let colWidths = [];
        for (let col = range.s.c; col <= range.e.c; col++) {
            let maxWidth = 5; // Valeur par défaut de largeur minimale
            for (let row = range.s.r; row <= range.e.r; row++) {
                let cell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
                if (cell && cell.v) {
                    maxWidth = Math.max(maxWidth, (cell.v.toString().length + 2));
                }
            }
            colWidths.push({ wpx: maxWidth * 8 }); // Largeur en pixels
        }
        ws['!cols'] = colWidths;

        // Créer le fichier Excel
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Etudiant");

        // Télécharger le fichier Excel avec un nom dynamique
        XLSX.writeFile(wb, `liste-de-${group.nom}.xlsx`);
    }

    // Restauration de l'affichage des éléments cachés après l'export
    buttonBack.style.display = "block";
    buttonContent.style.display = "block";
}


}
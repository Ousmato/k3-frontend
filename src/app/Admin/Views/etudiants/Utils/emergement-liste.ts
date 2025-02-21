import { Injectable } from "@angular/core";
import { InscriptionNoteDto, StudentGroupDto } from "../../../Models/Students";
import * as ExcelJS from 'exceljs';
import { Class_shared } from "../../../../DGA/class-students/Utils/Class-shared-methods";
import { EmploisJsonExcel } from "../../../../DER/EDT/Utils/emplois-json-excel";

@Injectable({
    providedIn: 'root' // Angular fournit une instance unique

})
export class StudentEmergement {

    inscriptions: InscriptionNoteDto[] = []
    groupes!: StudentGroupDto;

    constructor(private class_shared: Class_shared, private emploisJson: EmploisJsonExcel) { }
    public exportExcel(inscriptions: InscriptionNoteDto[], groupes: StudentGroupDto) {
        const fileName = `${groupes.nom}-${groupes.classe}-${groupes.semestre}-${this.class_shared.extractAnnee(groupes.annee)}-${this.class_shared.extractAnnee(groupes.annee) + 1}`;
        this.inscriptions = inscriptions;
        this.groupes = groupes;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Etudiants', {
            pageSetup: {
                paperSize: 9, // A4
                orientation: 'landscape', 
                fitToPage: false, // Désactive l'ajustement forcé sur une seule page
                fitToWidth: 1, // S'assure que le tableau tient en largeur
                fitToHeight: 0, // Permet d'utiliser plusieurs pages en hauteur
                margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
            }
        });

        const header = this.addHeader(worksheet);
        // this.addRows(worksheet);

        this.emploisJson.adjustColumnWidths(worksheet, header);

        this.addRows(worksheet);
        workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Liste des étudiants du ${fileName}`; // Nom du fichier
            a.click();
            window.URL.revokeObjectURL(url);
        }).catch((error) => {
            console.error('Erreur lors de la sauvegarde du fichier Excel', error);
        });

    }

    // add header
    private addHeader(worksheet: ExcelJS.Worksheet): string[] {
        const header = ['N°', 'Nom', 'Prénom', 'Lieu de naissance', 'Date de naissance', 'Sexe', 'Devoir', 'Examen', 'Emergement'];
        const module = `Module : ${this.groupes.nomModule}`
        const annee = `${this.class_shared.extractAnnee(this.groupes.annee)}-${this.class_shared.extractAnnee(this.groupes.annee) + 1}`

        const className = `Classe : ${this.groupes.classe}-${annee}`
        const semestre = ` Semestre : ${this.groupes.semestre}`
        const groupName =  this.groupes.nom ? `Groupe : ${this.groupes.nom}` : '';
        const firstRow = worksheet.addRow([module, '', '', groupName, '', className, '', '', semestre]);
        firstRow.height = 40;
        firstRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', wrapText: true, vertical: 'middle' };
            cell.border = { top: { style: 'thin' } };
        });
        const row = worksheet.addRow(header);
        row.eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', wrapText: true, vertical: 'middle' };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });

        return header;
    }

    // add rows
    private addRows(worksheet: ExcelJS.Worksheet) {
        let i = 1;
        this.inscriptions.forEach(inscription => {
            i++;
            const row = worksheet.addRow([i, inscription.nom, inscription.prenom, inscription.lieuNaissance, inscription.dateNaissance, inscription.sexe.includes('FEMME') ? 'F' : 'M', '', '', '']);
            row.eachCell((cell) => {
                // cell.font = { size: 16 };
                cell.alignment = { horizontal: 'center', wrapText: true, vertical: 'middle' };
                cell.border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            });
            row.height = 30;
        })
    }

}
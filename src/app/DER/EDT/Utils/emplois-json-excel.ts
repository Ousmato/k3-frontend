import { Inject, Injectable } from "@angular/core";
import { Class_shared } from "../../../DGA/class-students/Utils/Class-shared-methods";

import * as ExcelJS from 'exceljs';
import { teacherConfigureDto } from "../../../Admin/Models/Teachers";
import { Emploi_shared } from "./shareds-methods";
import { Emplois } from "../Models/Emplois";
import { StudentSharedMethods } from "../../../Admin/Views/Etudiants/Utils/Student-shared-methode";
import { AdminUSER } from "../../../Admin/Models/Auth";

@Injectable({
    providedIn: 'root',
})
export class EmploisJsonExcel {
    teacherConf : teacherConfigureDto [] = []
    test: { id: string, seanceType: string, module: string, groupe: string, date: string, heureDebut: string, heureFin: string, plageHoraire: string, nomTeacher: string, prenomTeacher: string }[] = [];
    datesWithDays: { day: string, date: string, dateDay?: string }[] = [];
    constructor(private class_shared: Class_shared, private emplois_shared: Emploi_shared, private student_shared: StudentSharedMethods) { }

    async exportAsExcelFile(test: { id: string, seanceType: string, module: string, groupe: string, date: string, heureDebut: string, heureFin: string, plageHoraire: string, nomTeacher: string, prenomTeacher: string }[],
        plageHoraire: string[], datesWithDays: { day: string; date: string; dateDay?: string }[],
        teacherConf: teacherConfigureDto[], emploi: Emplois
    ): Promise<void> {
        this.test = test;
        this.datesWithDays = datesWithDays;
        this.teacherConf = teacherConf;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('EDT', {
            pageSetup: {
                paperSize: 9, // A4
                orientation: 'landscape',
                fitToPage: true, // Adapter le contenu à la page
                fitToWidth: 1, // Adapter à la largeur de la page
                fitToHeight: 1, // Adapter à la hauteur de la page
                margins: { left: 0.7, right: 0.7, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
            },
        });
        this.addUnderHeader(emploi, worksheet);
        const header = this.generateHeader();


        worksheet.addRow(header).eachCell((cell) => {
            cell.alignment = { horizontal: 'center', vertical:'middle', wrapText: true };
            if (cell.value) {
                
                cell.font = { bold: true };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            }
        });

        // Ajuster la largeur des colonnes pour qu'elles s'adaptent à la page A4 en paysage
        this.adjustColumnWidths(worksheet, header);

        this.addRows(plageHoraire, worksheet, teacherConf);
        // this.addJourneeRow(worksheet, journee, datesWithDays);

        this.addFooter(worksheet)

        // Sauvegarder le fichier Excel
        await workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'emploi_du_temps.xlsx'; // Nom du fichier
            a.click();
            window.URL.revokeObjectURL(url);
        }).catch((error) => {
            console.error('Erreur lors de la sauvegarde du fichier Excel', error);
        });
    }

    private addUnderHeader(emploi: Emplois, worksheet: ExcelJS.Worksheet) {
        const periode = ` EDT ${emploi.dateDebut} au ${emploi.dateFin}`;
        const row = worksheet.addRow([periode]);
        row.font = { bold: true };
        row.alignment = { horizontal: 'left', vertical: 'middle' };
        // Fusionner les cellules
        const mergedRange = `A${row.number}:${this.getExcelColumnLetter(this.datesWithDays.length + 1)}${row.number}`;
        worksheet.mergeCells(mergedRange);

        // Ajouter une bordure en bas sur chaque cellule fusionnée
        row.eachCell((cell) => {
            cell.border = {
                bottom: { style: 'thick' } // "thick" pour une bordure noire plus visible
            };
        });
        row.height = 20; // Hauteur de la ligne
        const colFiliere = `Filière: ${this.class_shared.abreviateFiliereName(emploi.idClasse.idFiliere?.idFiliere.nomFiliere!)}`;
        const colNiveau = `Niveau: ${this.class_shared.abrevigateNiveauName(emploi.idClasse.idFiliere?.idNiveau.nom!)}-${emploi.idSemestre.nomSemetre}`;
        const colAnnee = `Année: ${this.emplois_shared.getMonth()}`;

        // Ajouter une ligne avec les valeurs bien positionnées
        const secRow = worksheet.addRow([
            colFiliere, // Première colonne (A)
            '', '',     // Colonnes vides pour le décalage
            colNiveau,  // Colonne centrale (D)
            '', '',     // Colonnes vides pour le décalage
            colAnnee    // Dernière colonne (G)
        ]);

        // Appliquer une police en gras
        secRow.font = { bold: true };

        // Centrer les textes dans chaque colonne
        secRow.eachCell((cell) => {
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
        });

        // Ajouter une bordure inférieure pour bien séparer cette ligne
        secRow.eachCell((cell) => {
            cell.border = {
                bottom: { style: 'medium' }, // Bordure noire visible
            };
        });

        secRow.height = 30; // Hauteur de la ligne

    }
    private generateHeader(): string[] {

        const header: string[] = ['Horaires'];
        this.datesWithDays.forEach((dateInfo) => {
            header.push(dateInfo.dateDay!);
        });
        return header;
    }

    public getExcelColumnLetter(columnNumber: number): string {
        let letter = '';
        while (columnNumber > 0) {
            const remainder = (columnNumber - 1) % 26;
            letter = String.fromCharCode(65 + remainder) + letter;
            columnNumber = Math.floor((columnNumber - 1) / 26);
        }
        return letter;
    }


    public adjustColumnWidths(worksheet: ExcelJS.Worksheet, header: string[]) {
        const totalWidth = 130; // Largeur totale estimée en mode paysage (en "unités Excel")
        const numberOfColumns = header.length;

        // Largeur moyenne dynamique par colonne pour occuper toute la largeur de la page
        const averageColumnWidth = totalWidth / numberOfColumns;

        worksheet.columns = header.map((col) => ({
            width: averageColumnWidth > 10 ? averageColumnWidth : 10, // Minimum 10
        }));
    }

    private addRows(plageHoraire: string[], worksheet: ExcelJS.Worksheet, teacherConf: teacherConfigureDto[]): void {
        plageHoraire.forEach((timeSlot) => {
            if (timeSlot === '12H00 - 14H00') {
                // Ajouter une ligne pour la pause
                const pauseRow = worksheet.addRow(['PAUSE']);
                pauseRow.eachCell((cell) => {
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };

                    cell.font = { bold: true };
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFCCCCCC' } // Couleur de fond grise
                    };

                });
                worksheet.mergeCells(`A${pauseRow.number}:${this.getExcelColumnLetter(this.datesWithDays.length + 1)}${pauseRow.number}`);
                worksheet.getRow(pauseRow.number).height = 30; // Hauteur de la pause
            } else {
                // Remplir les séances pour ce créneau horaire
                const rowValues: (string | null)[] = [timeSlot];
                this.datesWithDays.forEach((dateInfo, index) => {

                    const seance = this.test.find((s) =>
                        s.plageHoraire.includes(timeSlot) &&
                        dateInfo.day.toLowerCase() === this.emplois_shared.getDayFromDate(s.date?.toString()!)
                    );

                    if (seance) {

                        let cellContent = '';
                        if (seance.seanceType.toLowerCase() === 'examen') {
                            cellContent = `${seance.seanceType.toUpperCase()}`;
                        } else {
                            cellContent = `${seance.module} (${seance.seanceType.toUpperCase()})`;
                            if (seance.seanceType.toLowerCase() === 'td' && teacherConf.length === 0) {
                                cellContent += `\n${seance.nomTeacher.charAt(0).toUpperCase()}. ${seance.prenomTeacher}`;
                            } else {
                                cellContent += `\n${seance.nomTeacher.charAt(0).toUpperCase()}. ${seance.prenomTeacher}`;
                            }
                        }
                        rowValues.push(cellContent);
                    } else {
                        rowValues.push('NEANT');

                    }
                });

                // Ajouter la ligne au tableau
                const row = worksheet.addRow(rowValues);
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                    if (cell.value) {

                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    }

                });
                row.height = 70; // Hauteur de chaque ligne
            }
        });
    }
    private addFooter(worksheet: ExcelJS.Worksheet) {
        const admin = AdminUSER()?.der
        // Ajouter les séances des enseignants
        this.teacherConf.forEach(seance => {
            const row = worksheet.addRow([`${seance.nom} ${seance.prenom} : ${seance.seanceType}`]);
            row.font = { bold: true };
            row.alignment = { horizontal: 'left' };
        });
    
        // Ajouter les salles de cours (TD / CM)
        this.teacherConf.forEach(sal => {
            const salleLabel = sal.seanceType.includes('TD') ? "Salle TD :" : "Salle CM :";
            const row = worksheet.addRow([`${salleLabel} ${sal.groupe} : ${sal.salle}`]);
            row.font = { italic: true };
            row.alignment = { horizontal: 'left' };
        });
    
        // Ajouter un espace entre les infos et la signature
        worksheet.addRow([]); 
    
        // Ajouter la signature
        const date = `Ségou le, ${this.student_shared.getCurrentDate()}`;
        const chefDept = `Le chef de Département`;
        const adminName = `Dr ${admin.nom.charAt(0).toLocaleUpperCase()}. ${admin.prenom.toLocaleUpperCase()}`;
        const title = `Maître assistant`;
    
        const signatureRow0 = worksheet.addRow([date]);
        worksheet.mergeCells(`A${signatureRow0.number}:${this.getExcelColumnLetter(this.datesWithDays.length + 1)}${signatureRow0.number}`);

        const signatureRow1 = worksheet.addRow([chefDept]);
        worksheet.mergeCells(`A${signatureRow1.number}:${this.getExcelColumnLetter(this.datesWithDays.length + 1)}${signatureRow1.number}`);

        this.emplois_shared.gereateExcelRows(4, worksheet)
        const signatureRow2 = worksheet.addRow([adminName]);
        worksheet.mergeCells(`A${signatureRow2.number}:${this.getExcelColumnLetter(this.datesWithDays.length + 1)}${signatureRow2.number}`);
        
        const signatureRow3 = worksheet.addRow([title]);
        worksheet.mergeCells(`A${signatureRow3.number}:${this.getExcelColumnLetter(this.datesWithDays.length + 1)}${signatureRow3.number}`);
        // Aligner la signature à droite
        [signatureRow0, signatureRow1, signatureRow2, signatureRow3].forEach(row => {
            row.eachCell((cell, colNumber) => {
                // if (colNumber === 3) {
                    cell.alignment = { horizontal: 'right', vertical: 'middle', wrapText: true };

                // }
            });
        });
    
        // Ajouter des espaces pour respecter le format du document
        
    }



    

}


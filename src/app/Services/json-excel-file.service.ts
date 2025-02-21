import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { GetNoteDto, StudentsNotesDto } from '../Admin/Models/Notes';
import { ClassRoom } from '../Admin/Models/Classe';
import { Semestres } from '../Admin/Models/Semestre';
import { Class_shared } from '../DGA/class-students/Utils/Class-shared-methods';
import { StudentSharedMethods } from '../Admin/Views/Etudiants/Utils/Student-shared-methode';

@Injectable({
  providedIn: 'root'
})
export class JsonExcelFileService {

  constructor(private class_shared: Class_shared, private student_shared: StudentSharedMethods) { }

  async exportAsExcelFile_all_semestre_note(
    notes: GetNoteDto[],
    students: StudentsNotesDto[],
    classe: ClassRoom,
    specialite?: string,
    semestre?: Semestres
): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Résultat definitifs', {
        pageSetup: {
            paperSize: 9, // A4
            orientation: 'landscape',
            fitToPage: true,
            margins: { left: 0.7, right: 0.7, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
        }
    });

    // Définir les en-têtes
    const header = this.generateHeader(notes);
    const lastColumnLetter = this.getExcelColumnLetter(header.length-1);

    // Ajouter les en-têtes avant la table
    this.addHeaderRows(worksheet, header, classe, specialite, semestre);

    // Ajouter la ligne d'en-tête du tableau
    worksheet.addRow(header);
    this.styleHeaderRow(worksheet.getRow(5), header);

    // Ajuster la largeur des colonnes
    this.adjustColumnWidths(worksheet, header);

    // Ajouter les lignes de données
    const { studentAdmis, studentAjournnee, moduleAjournee } = this.addStudentRows(worksheet, students, notes);

    // ajouter le style de note ue
    this.addUeStyle(header, worksheet);
    // Ajouter les totaux d'ajournés
    this.addModuleAjourneeTotals(worksheet, header, moduleAjournee, notes);

    // Ajouter les pieds de page
    this.addFooterRows(worksheet, lastColumnLetter, studentAdmis, studentAjournnee, students.length);

    // Ajouter la signature
    this.addSignature(worksheet, lastColumnLetter);

    // Sauvegarder le fichier
    await this.saveWorkbook(workbook, classe, specialite, semestre);
}

// Fonctions utilitaires

private generateHeader(notes: GetNoteDto[]): string[] {
    const header = ['N°', 'Prénom', 'Nom', 'Date de naissance', 'Lieu de naissance', 'Sexe'];
    notes.forEach(note => {
        note.ues.modules.forEach(module => header.push(module.nomModule));
        header.push(`UE-${note.ues.code}`);
    });
    header.push('Moyen.Gen', 'Observation');
    return header;
}

private getExcelColumnLetter(columnNumber: number): string {
    let letter = '';
    while (columnNumber > 0) {
        const remainder = (columnNumber - 1) % 26;
        letter = String.fromCharCode(65 + remainder) + letter;
        columnNumber = Math.floor((columnNumber - 1) / 26);
    }
    return letter;
}

private addHeaderRows(worksheet: ExcelJS.Worksheet, header: string[], classe: ClassRoom, specialite?: string, semestre?: Semestres) {
    const schoolName = `Institu Universitaire de Formation Professionnelle (IUFP)`;
    const anneeScolaire = `Année Universitaire ${this.class_shared.extractAnnee(classe.idAnneeScolaire!)}-${this.class_shared.extractAnnee(classe.idAnneeScolaire!) + 1}`;
    const semestreName = `Résultat definitifs du semestre (${semestre!.nomSemetre})`;
    const classeName = `Mention: ${classe.idFiliere?.idFiliere.nomFiliere} ${specialite ? ', parcours ' + specialite : ''}`;

    worksheet.addRow([schoolName]).
    worksheet.mergeCells(`A1:${this.getExcelColumnLetter(header.length)}1`);
    worksheet.addRow([anneeScolaire])
    worksheet.mergeCells(`A2:${this.getExcelColumnLetter(header.length)}2`);
    worksheet.addRow([semestreName])
    worksheet.mergeCells(`A3:${this.getExcelColumnLetter(header.length)}3`);
    worksheet.addRow([classeName])
    worksheet.mergeCells(`A4:${this.getExcelColumnLetter(header.length)}4`);

    for (let i = 1; i <= 4; i++) {
        const row = worksheet.getRow(i);
        row.font = { bold: true, size: 12 };
        row.alignment = { vertical: 'middle', horizontal: 'center' };
    }
}

private styleHeaderRow(row: ExcelJS.Row, header: string[]) {
    row.font = { bold: true };
    row.height = 70;
    row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    row.eachCell((cell, colNumber) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCCC' } };
        if (colNumber > 6 && colNumber <= header.length) {
            cell.alignment = { textRotation: 90, horizontal: 'center' };
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
}

private adjustColumnWidths(worksheet: ExcelJS.Worksheet, header: string[]) {
    worksheet.columns.forEach((column, colNumber) => {
        if (colNumber > 5 && colNumber <= header.length) {
            column.width = 5;
            worksheet.getColumn(1).width = 5;
            worksheet.getColumn(6).width = 5;
            worksheet.lastColumn!.width = 11;
        } else if (colNumber <= 5) {
            column.width = 11;
        }
    });
}

private addStudentRows(worksheet: ExcelJS.Worksheet, students: StudentsNotesDto[], notes: GetNoteDto[]) {
    let studentAdmis = 0;
    let studentAjournnee = 0;
    let moduleAjournee: { nom: string, count: number }[] = [];

    students.forEach((student, index) => {
        const row = [
            index + 1,
            student.prenom,
            student.nom,
            student.date_naissance,
            student.lieuNaissance,
            student.sexe
        ];

        student.noteDTO.forEach(ue => {
            ue.ues.modules.forEach((module, index) => {
                row.push(student.moyenGeneral < 10 && module.noteModule! < 10 ? 'X' : '');
                if (student.moyenGeneral < 10 && module.noteModule! < 10) {
                    moduleAjournee.push({ nom: module.nomModule, count: 1 });
                }
            });
            row.push(ue.moyenUe);
        });

        row.push(student.moyenGeneral);
        row.push(student.moyenGeneral >= 10 && student.moyenGeneral <= 20 ? 'Admis' :
            student.moyenGeneral >= 3 && student.moyenGeneral < 10 ? 'Ajourné' : '--');

        if (student.moyenGeneral >= 10 && student.moyenGeneral <= 20) {
            studentAdmis++;
        } else {
            studentAjournnee++;
        }

        const addedRow = worksheet.addRow(row);
        this.styleDataRow(addedRow);
    });

    return { studentAdmis, studentAjournnee, moduleAjournee };
}

private styleDataRow(row: ExcelJS.Row) {
    row.eachCell((cell) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });
}

private addUeStyle(header: string[], worksheet: ExcelJS.Worksheet) {
   // Identifier les colonnes des UEs et appliquer une couleur de fond
   const ueColumnIndices: number[] = [];
   header.forEach((columnName, index) => {
     if (columnName.includes('UE-')) {
       ueColumnIndices.push(index + 1); // +1 car les indices des colonnes commencent à 1 dans ExcelJS
     }

   });
   ueColumnIndices.forEach((colIndex) => {
    // Appliquer au corps du tableau
    worksheet.getColumn(colIndex).eachCell((cell, rowNumber) => {
      if (rowNumber > 5) { // Ignorer l'en-tête (ligne 5)
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFCCCCCC' } // Couleur de fond verte claire
        };
      }
    });
  });
}

private addModuleAjourneeTotals(worksheet: ExcelJS.Worksheet, header: string[], moduleAjournee: { nom: string, count: number }[], notes: GetNoteDto[]) {
    const totalsRow: (string | number)[] = new Array(header.length).fill('');
    const countMap: { [key: string]: number } = {};

    moduleAjournee.forEach((module) => {
        countMap[module.nom] = (countMap[module.nom] || 0) + module.count;
    });

    notes.forEach(note => {
        note.ues.modules.forEach(module => {
            const columnIndex = header.indexOf(module.nomModule);
            if (columnIndex !== -1 && countMap[module.nomModule]) {
                totalsRow[columnIndex] = countMap[module.nomModule];
            }
        });
    });

    worksheet.addRow(totalsRow);
}

private addFooterRows(worksheet: ExcelJS.Worksheet, lastColumnLetter: string, studentAdmis: number, studentAjournnee: number, totalStudents: number) {
    const tauxReussite = ((studentAdmis / totalStudents) * 100).toFixed(2);

    const footerRow1 = worksheet.addRow([`Nombre d'Admis: ${studentAdmis}`]);
    const footerRow2 = worksheet.addRow([`Nombre d'Ajournés: ${studentAjournnee}`]);
    const footerRow3 = worksheet.addRow([`Taux de réussite: ${tauxReussite}%`]);
    worksheet.addRow([]);


    [footerRow1, footerRow2, footerRow3].forEach((row) => {
        worksheet.mergeCells(`A${row.number}:${lastColumnLetter}${row.number}`);
        row.font = { bold: true };
        row.alignment = { vertical: 'middle', horizontal: 'right' };
    });
}

private addSignature(worksheet: ExcelJS.Worksheet, lastColumnLetter: string) {
    const admin = this.class_shared.getUseSessionStorage();
    const currentDate = this.student_shared.getCurrentDate();

    const signatureR1 = worksheet.addRow([`Ségou le, ${currentDate}`]);
    const signatureR2 = worksheet.addRow([`Le Directeur Adjoint`]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    const signatureR6 = worksheet.addRow([`Dr ${admin.prenom} ${admin.nom}`]);
    const signatureR7 = worksheet.addRow([`Maitre Assistant`]);

    [signatureR1, signatureR2, signatureR6, signatureR7].forEach((row) => {
        worksheet.mergeCells(`A${row.number}:${lastColumnLetter}${row.number}`);
        row.font = { bold: true };
        row.alignment = { vertical: 'middle', horizontal: 'right' };
    });
}

private async saveWorkbook(workbook: ExcelJS.Workbook,  classe: ClassRoom, specialite?: string, semestre?: Semestres) {
    const fileName = `${this.class_shared.abreviateFiliereName(classe.idFiliere?.idFiliere.nomFiliere!)}${specialite ? '-' + specialite : ''}-${classe.idFiliere?.idNiveau.nom}-${semestre?.nomSemetre}-${this.class_shared.extractAnnee(classe.idAnneeScolaire!)}-${this.class_shared.extractAnnee(classe.idAnneeScolaire!) + 1}`;

    await workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
    }).catch((error) => {
        console.error('Error saving Excel file', error);
    });
}

}

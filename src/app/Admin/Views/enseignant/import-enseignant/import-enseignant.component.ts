import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { IconsService } from '../../../../Services/icons.service';
import { Diplomes, Teacher, TeachersStatus } from '../../../Models/Teachers';
import { PageTitleService } from '../../../../Services/page-title.service';
import { EnseiService } from '../ensei.service';
import { Admin } from '../../../Models/Admin';
import { AdminUSER } from '../../../Models/Auth';

@Component({
  selector: 'app-import-enseignant',
  templateUrl: './import-enseignant.component.html',
  styleUrl: './import-enseignant.component.css'
})
export class ImportEnseignantComponent implements OnInit {

  empty: any [] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  enseignants: Teacher [] = [];
  show_add : boolean = false;
  admin!: Admin
  constructor(public icons: IconsService, private datePipe: DatePipe, private pageTitle: PageTitleService,
    private teacherService: EnseiService,
  ){}

  ngOnInit(){
    this.admin = AdminUSER()?.der
  }

  // dowloaded file
  onFileChange(event: any): void {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      const arrayBuffer = e.target.result;
      this.parseExcel(arrayBuffer);
      this.show_add = true
    };

    fileReader.readAsArrayBuffer(file);
  }

   parseExcel(arrayBuffer: any): void {
      this.enseignants = []
  
      const workbook = new ExcelJS.Workbook();
      workbook.xlsx.load(arrayBuffer).then((workbook) => {
  
        workbook.eachSheet((worksheet, sheetId) => {
          worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            let rowData: any = {};
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
              switch (colNumber) {
                case 1:
                  rowData['nom'] = cell.value;
                  break;
                case 2:
                  rowData['prenom'] = cell.value;
                  break;
                
                case 3:
                  rowData['email'] = (typeof cell.value === 'object' && 'text' in cell.value!) ? cell.value.text : cell.value;
                  break;
                
                case 4:
                  rowData['telephone'] = cell.value;
                  break;
                case 5:
                  rowData['diplome'] = cell.value
                  break;
                case 6:
                  rowData['status'] = cell.value;
                  break;
                case 7:
                  rowData['sexe'] = cell.value;
                  break;
               
              }
            });
            // Traitement de rowData 
            const newenseignants = rowData;
            Number(newenseignants.telephone); // Conversion du téléphone
            if(newenseignants.diplome == "Master 2"){
              newenseignants.diplome = "M2"
            }
           
            // Ajouter à this.enseignants 
            this.enseignants.push(newenseignants);
  
        });
  
        this.enseignants.shift();
  
      });
    })
  }

  // add methode
  addTeachers(){
    console.log("teachers, ", this.enseignants)
    this.teacherService.addTeacher(this.enseignants, this.admin.idAdministra!).subscribe({
      next:(result) =>{
        this.pageTitle.showSuccessToast(result.message);
      },
      error: (err) =>{
        this.pageTitle.showErrorToast(err.error.message);
      }
    })
  }
}

import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { Student, Student_import } from '../../Admin/Models/Students';
import { ClassRoom } from '../../Admin/Models/Classe';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { SchoolService } from '../../Services/school.service';
import { AnneeScolaire } from '../../Admin/Models/School-info';
import { IconsService } from '../../Services/icons.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EtudeService } from '../../Admin/Views/etudiants/etude.service';
import { PageTitleService } from '../../Services/page-title.service';

@Component({
  selector: 'app-r-s-import',
  templateUrl: './r-s-import.component.html',
  styleUrl: './r-s-import.component.css'
})
export class RSImportComponent implements OnInit {

  students: Student[] = []
  classes: ClassRoom[] =[]
  show_add: boolean = false
  formAdd!: FormGroup
  promotion?: any
  annees: AnneeScolaire []= []
  constructor(private datePipe: DatePipe, private pageTitle: PageTitleService,
    public icons: IconsService, private fb: FormBuilder,
    private classService: ClassStudentService, private infoSchool: SchoolService, private studentService: EtudeService) { }

  
  ngOnInit(): void {
    this.get_annees();
    this.load_form();
  }

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

// --------------------------load form
  load_form(){
    this.formAdd = this.fb.group({
      idAnnee: ['', Validators.required],
      idClasse: ['', Validators.required]
    })
  }
  parseExcel(arrayBuffer: any): void {
    this.students = []

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
                rowData['matricule'] = cell.value;
                break;
              case 4:
                rowData['email'] = (typeof cell.value === 'object' && 'text' in cell.value!) ? cell.value.text : cell.value;
                break;
              case 5:
                rowData['password'] = (typeof cell.value === 'object' && 'text' in cell.value!) ? cell.value.text : cell.value;
                break;
              case 6:
                rowData['telephone'] = cell.value;
                break;
              case 7:
                rowData['lieuNaissance'] = cell.value;
                break;
              case 8:
                if (cell.value instanceof Date) {
                  rowData['dateNaissance'] = this.datePipe.transform(cell.value, 'yyyy-MM-dd');
                } else {
                  rowData['dateNaissance'] = cell.value; // Use the value as is if it's not a Date
                }
                break;
              case 9:
                rowData['status'] = cell.value;
                break;
              case 10:
                rowData['sexe'] = cell.value;
                break;
              case 11:
                rowData['scolarite'] = cell.value;
                break;
            }
          });
         this.students.push(rowData);

        });
      });
  
      console.log(this.students);
      this.students.shift();
    });
  }
  
  submit(){
   const formData = this.formAdd.value
   console.log(formData, "formData")
   const student : Student_import ={
    idAnnee: formData.idAnnee,
    idClasse: formData.idClasse,
    students: this.students

   }
   if(this.formAdd.valid){
    this.studentService.addStudentImport(student).subscribe({
      next: (res) =>{
        this.pageTitle.showSuccessToast(res.message);
        this.students = []
        this.show_add = false 

      },
      error : (erreur) =>{
        this.pageTitle.showErrorToast(erreur.error.message);
      }

    })
   }
   console.log(student, "object---------")
  }

     // -------------------------get annees
     get_annees(){
      this.infoSchool.getAll_annee().subscribe(data =>{
        this.annees = data;
        this.annees.forEach(ans=>{
          const annee = new Date(ans.debutAnnee)
          const debutAnnee = annee.getFullYear()
          ans.ans = debutAnnee
        })
      })
    }
  
    onSelect(event: any){
      const idAnne = event.target.value
      this.classService.getAllClasse(idAnne).subscribe(result =>{
        this.classes = result;
        // console.log(this.classes, "class");
      })
    }

}

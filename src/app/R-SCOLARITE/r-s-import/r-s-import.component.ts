import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { Inscription, Student, Student_import } from '../../Admin/Models/Students';
import { ClassRoom } from '../../Admin/Models/Classe';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { SchoolService } from '../../Services/school.service';
import { AnneeScolaire } from '../../Admin/Models/School-info';
import { IconsService } from '../../Services/icons.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EtudeService } from '../../Admin/Views/Etudiants/etude.service';
import { PageTitleService } from '../../Services/page-title.service';
import { Admin } from '../../Admin/Models/Admin';
import { AdminUSER } from '../../Admin/Models/Auth';
import { SideBarService } from '../../sidebar/side-bar.service';
import { EventServiceService } from '../../Services/event-service.service';
import { SharedMethodes } from '../Utils/SharedMethodes';

@Component({
  selector: 'app-r-s-import',
  templateUrl: './r-s-import.component.html',
  styleUrl: './r-s-import.component.css'
})
export class RSImportComponent implements OnInit {

  students: Student[] = []
  incrits: Inscription[] = []
  classes: ClassRoom[] = []
  classe!: ClassRoom
  date: string = ""
  show_add: boolean = false
  formAdd!: FormGroup
  promotion?: any
  @Output() event = new EventEmitter<any>();
  admin!: Admin
  annees: AnneeScolaire[] = []
  constructor(private datePipe: DatePipe, private pageTitle: PageTitleService, public mappers: SharedMethodes,
    public icons: IconsService, private fb: FormBuilder, private eventService: EventServiceService,
    private classService: ClassStudentService, private infoSchool: SchoolService, private studentService: EtudeService) { }


  ngOnInit(): void {
    this.get_annees();
    this.load_form();
    this.admin = AdminUSER()?.scolarite
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
  load_form() {
    this.formAdd = this.fb.group({
      idAnnee: ['', Validators.required],
      // idClasse: ['', Validators.required]
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
                rowData['matricule'] = cell.value;
                break;
              case 2:
                rowData['nom'] = cell.value;
                break;
              case 3:
                rowData['prenom'] = cell.value;
                break;

              // case 4:
              //   rowData['dateNaissance'] = (typeof cell.value === 'object' && 'text' in cell.value!) ? cell.value.text : cell.value;
              //   break;
              // case 5:
              //   rowData['password'] = (typeof cell.value === 'object' && 'text' in cell.value!) ? cell.value.text : cell.value;
              //   break;
              case 4:
                if (cell.value instanceof Date) {
                  rowData['dateNaissance'] = this.datePipe.transform(cell.value, 'yyyy-MM-dd');
                } else {
                  rowData['dateNaissance'] = cell.value; // Use the value as is if it's not a Date
                }
                break;
              case 5:
                rowData['lieuNaissance'] = cell.value;
                break;
             
              case 6:
                rowData['sexe'] = cell.value;
                break;
              case 7:
                rowData['status'] = cell.value;
                break;

              case 8:
                rowData['diplome'] = cell.value;
                break;
              case 9:
                rowData['niveau'] = cell.value;
                break;
              case 10:
                rowData['filiere'] = cell.value;
                break;
              case 11:
                rowData['nationalite'] = cell.value;
                break;
              case 12:
                rowData['telephone'] = cell.value;
                break;
              case 13:
                rowData['series'] = cell.value;
                break;
              // case 14:
              //   rowData['date'] = cell.value;
              //   break;
              case 14:
                rowData['numeroInscrit'] = cell.value;
                break;

            }
          });
          // Traitement de rowData pour ne pas inclure scolarite dans students
          const { numeroInscrit, filiere, niveau, ...newStudents } = rowData;
          // Number(newStudents.telephone); // Conversion du téléphone
          
          const mapper = new SharedMethodes();
          newStudents.status = mapper.mapStatus(newStudents.status)
          // const dtes = this.mappers.dateTransform(date)
          // console.log(dtes, "")
          // Ajouter à this.students sans scolarite
          this.students.push(newStudents);


          const nivf = {
            n: niveau,
            f: filiere,
          }
          // const niv = this.classes.find(c =>)
          if (nivf.f == "3ER") {
            nivf.f = "EEER";
          }
          const clas = this.classes.find(c =>
            mapper.abrevigateFiliereName(c.idFiliere?.idFiliere.nomFiliere!) == nivf.f && c.idFiliere?.idNiveau.nom == nivf.n)

          console.log("classe : ", nivf)
          // Créer une inscription
          const inscrit = {
            // date: date!,
            idAdmin: this.admin,
            idClasse: clas!,
            idEtudiant: newStudents,
            numeroInscrit: numeroInscrit
          };


          // Vérifier si l'étudiant est déjà inscrit
          // if (!this.incrits.some(i => i.idEtudiant.telephone == newStudents.telephone)) {
            this.incrits.push(inscrit);
          // }

        });

      });

      // this.incrits.shift();
      console.log(this.students,)
      if (this.incrits.length) {
        this.eventService.emitEvent("true")
      }
    });
  }

  annuler() {
    this.incrits = [];
    this.eventService.emitEvent("false")
  }
  submit() {

    const formData = this.formAdd.value
    this.classe = this.classes.find(c => c.id == +formData.idClasse)!;

    // this.incrits.forEach(is => is.date = this.mappers.dateTransform(is.date!))
    console.log(this.incrits.length, "student -- total")
    // return
      this.studentService.addStudentImport(this.incrits).subscribe({
        next: (res) => {
          this.pageTitle.showSuccessToast(res.message);
          this.incrits = []
          this.eventService.emitEvent("false")
          this.show_add = false

        },
        error: (erreur) => {
          this.pageTitle.showErrorToast(erreur.error.message);
        }

      })
    
  }
  // -------------------------get annees
  get_annees() {
    this.infoSchool.getAll_annee().subscribe(data => {
      this.annees = data;
      this.annees.forEach(ans => {
        const annee = new Date(ans.debutAnnee)
        const debutAnnee = annee.getFullYear()
        ans.ans = debutAnnee
        ans.nextYear = annee.getFullYear() + 1
      })
    })
  }

  onSelect(event: any) {
    const idAnne = event.target.value
    this.classService.getAllClasse(idAnne, this.admin.idAdministra!).subscribe(result => {
      this.classes = result;
      // console.log(this.classes, "class");
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { IconsService } from '../../../Services/icons.service';
import { SemestreService } from '../../../Services/semestre.service';
import { EtudeService } from '../../Views/etudiants/etude.service';
import { GetNoteDto, NoteDto, Notes } from '../../Models/Notes';
import { ActivatedRoute } from '@angular/router';
import { Inscription, Student } from '../../Models/Students';
import { Semestres } from '../../Models/Semestre';
import jspdf, { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Admin } from '../../Models/Admin';
import { InscriptionService } from '../../../Services/inscription.service';
import { AdminUSER } from '../../Models/Auth';

@Component({
  selector: 'app-student-bulletin',
  templateUrl: './student-bulletin.component.html',
  styleUrl: './student-bulletin.component.css'
})
export class StudentBulletinComponent implements OnInit {
  idStudent!: number
  moyenneGenerale: number = 0
  mention: string = "";
  inscrit!: Inscription
  isImprime: boolean = true
  semestres: Semestres[] = [];

  adminRscolarite!: Admin
  


  notes: GetNoteDto[] = [];

  constructor(public icons: IconsService, private root: ActivatedRoute,
    private semestreService: SemestreService, private studentService: EtudeService, private inscriptionService: InscriptionService) { }
  ngOnInit(): void {
    // this.load_bulletin();
    // this.load_ues()
    this.adminRscolarite = AdminUSER()?.scolarite;
    this.load_student();

  }

  //  --------------------------------------button to imprime
  imprimer() {
    const button = document.getElementById('bulletin__content') as HTMLElement
    button.style.display = "none"
    const head = document.getElementById('bulletin') as HTMLElement;
    head.style.display = "block"
    const foot = document.getElementById('footer') as HTMLElement;
    foot.style.display = "flex"


    
    var data = document.getElementById('section')!;
    //Id of the table
    
      data.style.paddingLeft = "70px";
      data.style.paddingRight = "70px";
      data.style.paddingTop = "70px";
      data.style.fontSize = "18px";
    html2canvas(data!, { scale: 2 }).then(canvas => {

      // Few necessary setting options  
      let imgWidth = 208;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save(`releve_note_${this.inscrit.idEtudiant.nom}_${this.inscrit.idEtudiant.prenom}.pdf`);
      button.style.display = "block"
      head.style.display = "none"
      foot.style.display = "none"
    });
  }
  // imprimer() {
  //   const head = document.querySelector('.head') as HTMLElement;
  //   const button = document.getElementById('btn-contenair') as HTMLElement;
  //   const backButton = document.getElementById('back-button') as HTMLElement;
  
  //   // Masquer les boutons
  //   head.style.display = 'block';
  //   button.style.display = "none";
  //   backButton.style.display = "none";
  

  //   var data = document.querySelector('.bulletin') as HTMLElement;
  //   var foot = document.getElementById('foot') as HTMLElement;
  //   foot.style.display = 'block';
  //   foot.style.paddingBottom = '70px';
  //   foot.style.paddingLeft = '70px';
  //   foot.style.paddingRight = '70px';
  //     data.style.paddingLeft = "70px";
  //     data.style.paddingRight = "70px";
  //     data.style.paddingTop = "70px";
  //     data.style.fontSize = "18px";
  //     console.log(data, "data");
  //   //   //Id of the table
  //   html2canvas(data!, { scale: 2 }).then(canvas => {
  //     const contentDataURL = canvas.toDataURL('image/png');
  //     let imgWidth = 208;
  //     let imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     let pdf = new jsPDF('p', 'mm', 'a4'); // Taille A4 du PDF
  //     let position = 0;
      
  
  //     // Ajout de l'image
  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
     
  //     // Préparation des données pour le tableau
  //     const tableData : any[] = [];
  //     this.notes.forEach(note => {
  //         note.ues.modules.forEach((module, index) => {
  //             tableData.push([
  //                 index === 0 ? note.ues.nomUE : '',
  //                 module.nomModule || '',
  //                 index === 0 ? note.coefUe : '',
  //                 index === 0 ? note.session : '',
  //                 module.noteModule || '',
  //                 '',
  //                 index === 0 ? note.moyenUe : '',
  //                 ''
  //             ]);
  //         });
  //     });
  
  //     // Génération du tableau après l'image
  //     autoTable(pdf, {
  //         startY: imgHeight + 10, // Position en dessous de l'image
  //         head: [['UE', 'ECUE', 'Coefficient', 'session', 'Moyenne', 'PJ ECUES', 'Moyenne UE', 'PJ UE']],
  //         body: tableData,
  //     });
  
  //     // Sauvegarde du fichier PDF
  //     pdf.save('releve_de_note.pdf');
  //     this.isImprime = false;
  //     backButton.style.display = "block";
  //     head.style.display = "none";
  // });
  // }  
  
  // -------------------------

  load_student() {
    this.root.queryParams.subscribe(params => {
      this.idStudent = +params['id'];
      this.inscriptionService.getInscriptionById(this.idStudent).subscribe(student => {
        this.inscrit = student;
        console.log(this.inscrit, "student")
        this.load_semestre()
      });
    });

    

  }
  load_semestre() {

    this.semestreService.getCurrentSemestresByIdNivFiliere(this.inscrit.idClasse?.idFiliere?.id!).subscribe(result => {
      result.forEach(res => {
        if (!this.semestres.some(sem => sem.id == res.id)) {
          this.semestres.push(res)
        }
      })
      console.log(this.semestres, "semestre")
    })
  }
  // ---------------load all semestre oc classe

  onSelect(event: any) {
    const idSemestre = event.target.value;
    this.studentService.getAllNoteByIdStudent(this.idStudent, idSemestre).subscribe(note => {
      this.notes = note;
      console.log(this.notes, "notes student")

    });
  }
  goBack() {
    window.history.back();
  }
  // ---------------------get current date
  getCurrentDate() : string{
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long',  year: 'numeric'};
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  }

}

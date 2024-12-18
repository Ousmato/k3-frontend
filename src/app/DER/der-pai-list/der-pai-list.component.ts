import { Component, OnInit } from '@angular/core';
import { EnseiService } from '../../Admin/Views/enseignant/ensei.service';
import { PaieDTO } from '../../Admin/Models/paie';
import { IconsService } from '../../Services/icons.service';
import { SideBarService } from '../../sidebar/side-bar.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-der-pai-list',
  templateUrl: './der-pai-list.component.html',
  styleUrl: './der-pai-list.component.css',
  animations: [
    trigger('zoom', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DerPaiListComponent implements OnInit {

  searchTerm: string = ''
  month: string = ''
  filteredPai: PaieDTO[] = []
  paies: PaieDTO[] = [];
  months: { value: number, name: string }[] = []

  constructor(private teacherService: EnseiService, public icons: IconsService, private sideBarService: SideBarService) { }

  ngOnInit(): void {
    this.getAllPaie();
    this.sideBarService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filteredPaie();
      this.initializeMonths();

    });

  }
  // load all paie in month
  getAllPaie() {
    this.teacherService.getAllPaie().subscribe(result => {
      // this.paies = result;
      console.log("resultat : ", result)
      result.forEach(res => {
        if (!this.paies.some(p => p.idTeacher == res.idTeacher)) {
          res.montant = res.coutHeure * res.nbreHeures
          const formatter = Intl.NumberFormat(
            'fr-FR',
            {
              style: 'currency',
              currency: 'XOF',
            },
          )
          res.montanFormat = formatter.format(res.montant);
          const date = new Date(res.date);
          this.month = date.toLocaleString('fr-FR', { month: 'long' });


          this.paies.push(res);
        }
      })
      console.log(this.paies, "paie--------------------------")
    })
  }
  // -----------------------filter method
  filteredPaie() {
    if (!this.searchTerm) {
      return this.filteredPai = this.paies
    }
    return this.filteredPai = this.paies.filter(p => p.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()))
  }
  goBack() {
    this.searchTerm = ''
    window.history.back();

  }
  //  ----------------------imprime button
  imprimer() {
    // const buttonContent = document.getElementById('button') as HTMLElement;
    // buttonContent.style.display = "none";
    var data = document.getElementById('idTable') as HTMLElement;
    if (data) {
      data.style.padding = '50px';
      // data.style.fontSize = "14px"  
    }

    // Id of the table
    html2canvas(data!, { scale: 2 }).then(canvas => {
      // Few necessary setting options
      let imgWidth = 297; // A4 landscape width in mm
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape
      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('programme-de-soutenace.pdf');
      // buttonContent.style.display = "block";
      data.style.padding = '0px'
      // data.style.fontSize = '16px'
    });
  }
  // -----get all month
  checkMonth(event: any) {
    const month = event.target.value
    this.paies = []
    // console.log(month, "month")
    this.teacherService.getAllPaieByMonth(month).subscribe(result => {
      result.forEach(res => {
        if (!this.paies.some(p => p.idTeacher == res.idTeacher)) {
          res.montant = res.coutHeure * res.nbreHeures
          const formatter = Intl.NumberFormat(
            'fr-FR',
            {
              style: 'currency',
              currency: 'XOF',
            },
          )
          res.montanFormat = formatter.format(res.montant)
          const date = new Date(res.date);
          this.month = date.toLocaleString('fr-FR', { month: 'long' });
          this.paies.push(res);
        }
      })
      this.filteredPai = this.paies
    })
  }

  initializeMonths() {
    for (let i = 0; i < 12; i++) {
      const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(2023, i));
      this.months.push({ value: i + 1, name: monthName });
    }
    // console.log(this.months, " months")
  }
  // abrevigation
  abrevigateName(name: string): string {
    const splitName = name.split(' ')
    const word = splitName.filter(wrd => wrd.length > 3).map(wrd => wrd[0].toUpperCase()).join('')
    return word;
  }
}

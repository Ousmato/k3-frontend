import { Inject, Injectable, OnDestroy } from "@angular/core";
import { Inscription, Student, Student_group, Type_status } from "../../../Models/Students";
import { AnneeScolaire } from "../../../Models/School-info";

import jspdf, { jsPDF } from 'jspdf';  
import html2canvas from 'html2canvas';
import { Chart, registerables } from "chart.js";
Chart.register(...registerables)
@Injectable({
    providedIn: 'root',
})
export class StudentSharedMethods implements OnDestroy{
  private myChart: any
    inscrits: Inscription[] = [];

    ngOnDestroy(): void {
      if (this.myChart) {
        this.myChart.destroy();
      }
    }
    public statusMapper(status: string): string {
        switch (status) {
            case "REGULIER":
                return "REG"; // Abréviation
            case "CANDIDAT LIBRE":
                return "CL"; // Abréviation
            case "FORMATION CONTINUE":
                return "FC"; // Abréviation
            case "PROFESSIONNEL COLLECTIVITE":
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
    if(word === 'EER') return'3ER';
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

//get date in this format le 25 fevrier 2025
getCurrentDate() : string{
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long',  year: 'numeric'};
  
  // console.log(Intl.DateTimeFormat('fr-FR', options).format(date))
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
}

  // filter students

 // sort students
 onSorted(event: any, Inscriptions : Inscription[]) : any{
    const value: keyof Student = event.target.value; // Obtenir la valeur de tri (nom ou prénom)
    console.log(value, "value");
    const filteredStudents = Inscriptions;
  
    // Trier les étudiants filtrés en fonction du critère sélectionné
    this.inscrits = filteredStudents.sort((a, b) => {
      const valA = a.idEtudiant[value]?.toString().toLowerCase() || ''; // Récupérer la valeur de a et la convertir en minuscule
      const valB = b.idEtudiant[value]?.toString().toLowerCase() || ''; // Récupérer la valeur de b et la convertir en minuscule
      
      if (valA < valB) return -1; // a avant b
      if (valA > valB) return 1;  // a après b
      return 0; // égalité
    });
  
    // console.log(this.inscrits, "inscrits après tri");
  }

//select file
triggerFileInput(): void {
    const fileInput = document.querySelector<HTMLInputElement>('#inputPhoto');
    if (fileInput) {
      fileInput.click(); // Déclencher un clic programmatique
    }
  }
  
// circle statistique students
createChart(statistic: any): void {
  if (this.myChart) {
    this.myChart.destroy(); // Détruire l'ancien graphique
  }
  this.myChart = new Chart('myChart', {
    type: 'pie',
    data: {
      labels: ['Payer', 'Non Payer', 'Avec Dette'],
      datasets: [{
        label: 'Pourcentage de Paiement ',
        // Utiliser des valeurs numériques sans le symbole %
        data: [statistic.dettePurcent, statistic.notPayePurcent, statistic.payePurcent],
        backgroundColor: ['green', 'red', 'gray'],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'Pourcentage de Paiement des Étudiants/ans',
        },
        // Ajouter le formatage des tooltips
        tooltip: {
          callbacks: {
            label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}%`; // Ajouter le symbole % dans le tooltip
            }
          }
        }
      }
    },
  });
  }
}
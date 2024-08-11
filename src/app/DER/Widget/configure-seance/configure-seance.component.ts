import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Seances, type_seance } from '../../../Admin/Models/Seances';
import { ServiceService } from '../../emplois-du-temps/service.service';
import { SeancService } from '../../../Admin/Views/emplois-seance/seanc.service';
import { Emplois } from '../../../Admin/Models/Emplois';
import { Configure_seance } from '../../../Admin/Models/Configure_seance';
import { PageTitleService } from '../../../Services/page-title.service';
import { Participant } from '../../../Admin/Models/Students';
import { EtudeService } from '../../../Admin/Views/etudiants/etude.service';

@Component({
  selector: 'app-configure-seance',
  templateUrl: './configure-seance.component.html',
  styleUrl: './configure-seance.component.css'
})
export class ConfigureSeanceComponent implements OnInit {

  @Input() idEmplois!: number
  @Input() configSeance: Configure_seance [] =[]
  @Output() closeModal = new EventEmitter<any>();

  seances: Seances [] = [];
  seance_type: string[] = [];
  emplois!: Emplois;
  plageHoraire: string[]= [];
  plage!: string
  list_checked: string[] =[]
  is_show_plag: boolean = false
  
  datesWithDays: { day: string, date: string }[] = [];
  datesWithDaysTest: { day: string, dates: string[] }[] = [];
  pause_matin: string [] = [];
  pause_midi: string [] = [];
  typeSeanceOptions: { key: string, value: string }[] = []
  form_configure!: FormGroup
  participants: Participant [] = []
  constructor(private fb: FormBuilder, private pageTitle: PageTitleService, private studentService: EtudeService,
    private seanceService: SeancService, private emploisService: ServiceService ) { }

  ngOnInit(): void {
    this.typeSeanceOptions = this.getStatusOptions()
    this.load_form();
    this.loadEmploisByClass();
  }

  // ---------------load form
  load_form(){
    this.seance_type = Object.values(type_seance);
    this.form_configure = this.fb.group({
      idSeance: ['',[Validators.required]],
      idParticipant: ['',[Validators.required]],
      seanceType: ['', Validators.required] 
    });
  }

  add_configure(){
    const formData = this.form_configure.value
    let plage : Configure_seance[]=[]
    this.list_checked.forEach(checked =>{
      const heureDebut = checked.slice(0,5)
      const heureFin = checked.slice(8)
      const participant = this.participants.find(p =>p.id == formData.idParticipant)
      const seance =  this.seances.find(s =>s.id == +formData.idSeance);

      const config_seance: Configure_seance ={
        idSeance: seance!,
        idParticipant: participant!,
        seanceType: formData.seanceType,
        heureDebut: heureDebut,
        heureFin: heureFin
      }
      plage.push(config_seance)
      console.log(config_seance, "confi")
      // return
      this.seanceService.addConfigureSeance(plage).subscribe({
        next: (response) =>{
          this.pageTitle.showSuccessToast(response.message);
          
          this.form_configure.reset();
          this.load_form();
          this.loadEmploisByClass();
          this.closeModal.emit();
        },
        error: (erreur) =>{
          this.pageTitle.showErrorToast(erreur.error.message);
        }
        
      })
    })
   
  }
  // -------------------------------loadEmplois
  loadEmploisByClass() : void{
    this.emploisService.getEmploisByClasse2(this.idEmplois).subscribe(data  =>{
      this.emplois = data;
      const dateDebut = this.emplois.dateDebut;
      const dateFin = this.emplois.dateFin;
      this.datesWithDays = this.emploisService.getDaysBetweenDates(dateDebut, dateFin)
      this.datesWithDays.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      this.getAllSeance(this.emplois.id!);
      this.load_participation_by_emploi(this.emplois.id!)
    })
  }
  // -----------------------load seance by id emplois
  getAllSeance(idEmplois : number){
    this.seanceService.getAllByEmploisId(idEmplois).subscribe((data: Seances[]) => {
      this.seances = data;
      this.seances.forEach(seance => {
        this.datesWithDays.forEach(dwd =>{
          if(seance.date?.toString() === dwd.date){
            seance.jour = dwd.day;
          }
        })
        const date = new Date()
        const pauseMatin = seance.pause_matin?.toString().slice(0,5);
        const pauseMidi = seance.pause_midi?.toString().slice(0,5);

        if (pauseMatin) {
          const [hours, minutes] = pauseMatin.split(':').map(Number);
            const hpause = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
            hpause.setMinutes(hpause.getMinutes() + 15);
            const pause_matin_fin = hpause.toTimeString().split(' ')[0]; // Format HH:mm:ss
            const timePair = `${pauseMatin} - ${pause_matin_fin}`;
            if (!this.pause_matin.includes(timePair)) {
              this.pause_matin.push(timePair);
            }
            // console.log(this.pause_matin)
        }

        if (pauseMidi) {
          const [hours, minutes] = pauseMidi.split(':').map(Number);
            const hpause = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
            hpause.setHours(hpause.getHours() + 2);
            const pause_midi_fin = hpause.toTimeString().split(' ')[0]; // Format HH:mm:ss
            const timePair = `${pauseMidi} - ${pause_midi_fin}`;
            if (!this.pause_midi.includes(timePair)) {
              this.pause_midi.push(timePair);
            }
            // console.log(this.pause_midi)
        }

       seance.heureDebut = seance.heureDebut.slice(0, 5); // Garder les 5 premiers caractères (HH:mm)
        seance.heureFin = seance.heureFin.slice(0, 5); 
      });
      // console.log(this.seances, "seances");
    })
  }
  // ---------------------close modal
  close(){
    this.closeModal.emit();
  }

  getStatusOptions(): { key: string, value: string }[] {
    return Object.keys(type_seance).map(key => ({
      key: key,
      value: type_seance[key as keyof typeof type_seance] 
    }));
  }
  // --------------------on seance select
  onSelect(event: any) {
    this.is_show_plag = true;
    const seance = this.seances.find(s => s.id == +event.target.value);

    if (seance) {
        // Crée une copie de la liste des plages horaires de la séance
        let updatedPlageHoraire = [...seance.plageHoraire!];
        this.configSeance.forEach(cf => {
            if (cf.idSeance.id == seance.id) {
                // Filtre les plages horaires de la séance pour enlever celles qui correspondent
                updatedPlageHoraire = updatedPlageHoraire.filter(plage => plage !== cf.plageHoraire);
            }
        });
        this.plageHoraire = updatedPlageHoraire;
    }
}


   // -------------------------------load all participation by idEmploi
   load_participation_by_emploi(idEmploi: number){
    this.studentService.getParticipantsByEmploiId(idEmploi).subscribe((data) => {
      data.forEach(part =>{
        if(!this.participants.some(d=>d.idStudentGroup.id == part.idStudentGroup.id)){
        this.participants.push(part)
      }
      })
      
      console.log(this.participants, "participations");
    })
  }
  // -------------------------check plag horaire
  student_check(item : string, event: any){
    const student_fund = this.plageHoraire.find(p => p === item);

    if (student_fund) {
      if (event.target.checked) {
        if (!this.list_checked.some(pl => pl === item)) {
          this.list_checked.push(student_fund);
        }
      } else {
        this.list_checked = this.list_checked.filter(st => st!== student_fund);
      }
      console.log(this.list_checked, event.target.checked ? "checked" : "unchecked");
    }
  }

  is_checked(plag: string): boolean {
    return this.list_checked.some(st => st === plag);
  }
}

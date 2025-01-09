import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Teacher } from '../../../Admin/Models/Teachers';
import { EnseiService } from '../../../Admin/Views/Enseignant/ensei.service';
import { SalleService } from '../../../Services/salle.service';
import { Salles } from '../../../Admin/Models/Salles';
import { Jury, Jury_role, ProgramSoutenance, Soutenance } from '../../../Admin/Models/doc';
import { IconsService } from '../../../Services/icons.service';
import { ActivatedRoute } from '@angular/router';
import { EtudeService } from '../../../Admin/Views/Etudiants/etude.service';
import { PageTitleService } from '../../../Services/page-title.service';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs';
import { Admin } from '../../../Admin/Models/Admin';
import { AdminUSER } from '../../../Admin/Models/Auth';

@Component({
  selector: 'app-program-soutenance',
  templateUrl: './program-soutenance.component.html',
  styleUrl: './program-soutenance.component.css'
})
export class ProgramSoutenanceComponent implements OnInit {

  prog_form!: FormGroup
  @Input() idDoc!: number | null
  @Output() closeModal = new EventEmitter<any>();
  teachers?: Teacher[] = []
  salle?: Salles
  admin!: Admin
  numberJury: any[] = [1, 2, 3]

  jury: Jury[] = []
  soutenance!: Soutenance
  selectedJuryIndex: number | null = null;
  isSalle: boolean = false
  isTeacher: boolean = false
  usedTeachers: Set<{ teacher: number, role: string }> = new Set();
  juryRole: { key: string, value: string }[] = []

  constructor(private fb: FormBuilder, private teacherService: EnseiService, private datePipe: DatePipe,
    private pageTitle: PageTitleService,
    private studentService: EtudeService,
    private root: ActivatedRoute,
    public icons: IconsService,
    private salleService: SalleService) { }

  ngOnInit(): void {
    this.loa_form();
    this.getAllTeacher();
    this.getAllSalles();

    this.admin = AdminUSER()?.der

  }

  // --------------------------load form
  loa_form() {
    this.root.queryParams.subscribe(param =>{
      this.idDoc = param['id'];
    })
    this.prog_form = this.fb.group({
      idDoc: [this.idDoc],
      date: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      salle: ['', Validators.required],
      jurys: this.fb.array([ // Un FormArray pour gérer plusieurs jurys
        this.createJuryGroup('PRESIDENT'),
        this.createJuryGroup('RAPPORTEUR'),
        this.createJuryGroup('RAPPORTEUR')
      ])
    });
  }
  createJuryGroup(role: string): FormGroup {
    return this.fb.group({
      nomJury: ['', Validators.required],
      idTeacher: [''],
      role: [role]
    });
  }

  juryControls(): FormArray {
    return this.prog_form.get("jurys") as FormArray
  }
 
  submit() {
    this.jury = []
    const formData : any = this.prog_form.value
    const jurys = formData.jurys;
    // let teacher: Teacher
    console.log(formData, "farmData")
   jurys.forEach((jr: any) => {
      // teacher = this.teachers.find(t => t.idEnseignant == jr.teacher)!;
      const jury: Jury = {
        role: jr.role,
        idTeacher: jr.idTeacher!,
       
      }
      this.jury.push(jury)
      // console.log(jury, "jury")

    })

    
    this.soutenance = {
      date: formData.date,
      heureDebut: formData.heureDebut,
      heureFin: formData.heureFin,
      idDoc: formData.idDoc,
      idSalle: this.salle!,
      idAdmin: this.admin.idAdministra!
      
    }
    const prog : ProgramSoutenance ={
      jurys: this.jury,
      soutenance: this.soutenance
    }
    console.log(prog, "souuuuuuuuuuuuuuuuu")
    // return
    if (this.prog_form.valid) {
      this.studentService.createSoutenance(prog).subscribe({
        next: (result) => {
          this.pageTitle.showSuccessToast(result.message);
          this.prog_form.reset();
          this.loa_form();
        },
        error: (error) => {
          this.pageTitle.showErrorToast(error.error.message);
          
        }


      })
    } else {
      this.prog_form.markAllAsTouched();
      console.log(this.prog_form.value, "inavlid")
    }

  }
  // --------------------------get all teachers
  getAllTeacher() {
    const jurysArray = this.prog_form.get('jurys') as FormArray;
    jurysArray.controls.forEach((juryControl, index) => {
      this.subscribeToControl(juryControl.get('nomJury'), index);
    });
  }

  private subscribeToControl(control: AbstractControl | null, index: number) {
    this.teachers = []
    control?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      tap(value => console.log('Valeur avant switchMap:', value)),
      
      switchMap(value => this.teacherService.getListFilteredTeachers(value)) // interrompt la requête en cours si une nouvelle valeur arrive
      // console.log(value)
    ).subscribe(result => {
      console.log(result, "resultat")
      if (result && result != null) {
        this.teachers = result; 
      }
    });
  }


  // --------------------------get all salles
  getAllSalles() {

    this.prog_form.get("salle")?.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      console.log(value, "value")
      var display = document.getElementById("salle-nom") as HTMLElement;
      display.style.display = "none"
      this.salleService.getSalleByNom(value).subscribe(result => {
        this.salle = result
        display.style.display = "block";
       

        console.log(this.salle, "les sales")
      })
    })
  }

  setSelectedJuryIndex(index: number) {
    this.selectedJuryIndex = index;
  }

  selectTeacher(teach: any) {
    if (this.selectedJuryIndex !== null) {
      const juryControl = this.juryControls().at(this.selectedJuryIndex);
      juryControl.get('idTeacher')?.setValue(teach.idEnseignant);
      juryControl.get('nomJury')?.setValue(`${teach.nom} ${teach.prenom}`);
     
    }
  }
  // -----------------------go back
  goBack() {
    window.history.back()
  }

  // ------------------------calculate hours
  calculateHours(): number {
    const debut = new Date(this.prog_form.get('heureDebut')?.value);
    // Ajouter 45 minutes à l'heure de début
    const fin = new Date(debut);
    fin.setMinutes(debut.getMinutes() + 45);

    // Calculer la différence en millisecondes
    const diff = fin.getTime() - debut.getTime();

    // Convertir la différence en heures (si nécessaire, sinon vous pouvez calculer en minutes)
    const hours = diff / (1000 * 60 * 60);
    return hours;
  }

  heureChange(event: any) {
    const heureDebut = event.target.value
    const date = new Date();
    // Calculer les heures de fin en ajoutant 45 minutes à l'heure de début
    const [hours, minutes] = heureDebut.split(':').map(Number);

    // Créer un objet Date avec l'heure de début
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    const fin = new Date(date);
    fin.setMinutes(fin.getMinutes() + 45);

    const time = this.datePipe.transform(fin, "HH:mm");
    console.log(time, "hours");

    this.prog_form.get('heureFin')?.setValue(time);
  }
}

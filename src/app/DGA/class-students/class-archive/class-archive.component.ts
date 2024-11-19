import { Component, OnInit } from '@angular/core';
import { IconsService } from '../../../Services/icons.service';
import { ClassRoom } from '../../../Admin/Models/Classe';
import { ClassStudentService } from '../class-student.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AdminUSER } from '../../../Admin/Models/Auth';

@Component({
  selector: 'app-class-archive',
  templateUrl: './class-archive.component.html',
  styleUrl: './class-archive.component.css'
})
export class ClassArchiveComponent implements OnInit {

  classesArchives: ClassRoom[]=[]
  idNivFiliere!: number
  classeSelect! : any
  isShow_link_modal: boolean = true

  constructor(public icons: IconsService, private router: Router,
     private classService: ClassStudentService, private root: ActivatedRoute){}

  ngOnInit(){
    this.load_archives();
    this.getPermission()
  }

  load_archives(){
    this.root.queryParams.subscribe(param =>{
      this.idNivFiliere = +param['id'];
    })
    this.classService.getAllArchivesByClasseIdNivFil(this.idNivFiliere).subscribe(result =>{
      this.classesArchives = result
      this.classesArchives.forEach(ca =>{
       
          const date = new Date(ca.idAnneeScolaire!.finAnnee);
          ca.idAnneeScolaire!.ans = date.getFullYear();
 
      })
      console.log(this.classesArchives, "archivesss")
   })
  }

 
  show_views(classe: any){
    console.log(classe,"dois etre changer")
    if (this.classeSelect === classe) {
      this.classeSelect = null; // Deselect if already selected
    } else {
      this.classeSelect = classe; // Select the clicked item
     
    }
  }
  // --------------------------
  toggle_to_presence(idClasse: number){
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idClasse }
    };
    if(this.getPermission()){
    this.router.navigate(['/r-scolarite/etudiant-de-la-classe'], navigationExtras);
    }else{
      this.router.navigate(['/dga/etudiant-de-la-classe'], navigationExtras);
    }
  }
  // ----------------------
  toggle_to_noteSemestre(idClasse: number){
    const navigationExtras: NavigationExtras = {
      queryParams: { id: idClasse }
    };
    if(this.getPermission()){
    this.router.navigate(['/r-scolarite/all-notes'], navigationExtras);
    }else{
    this.router.navigate(['/dga/all-notes'], navigationExtras);
    }
   
  }

  // ----------------------------
  toggle_to_view_ues(classe: ClassRoom) {
    console.log(classe, "----------------class")
    const navigationExtras : NavigationExtras ={
      queryParams: { id: classe.id}
      
    }
    if(this.getPermission()){
      this.router.navigate(['/r-scolarite/view-ues'], navigationExtras);
    }else{
      this.router.navigate(['/dga/view-ues'], navigationExtras);
    }
      
    }

    getPermission(): boolean {
      const autorize = AdminUSER()?.scolarite;
      if (autorize) {
        console.log(autorize, "autorize")
        return true;
      }
      return false
    }
  
    // -----------------------
    goBack(){
      window.history.back();
    }
}

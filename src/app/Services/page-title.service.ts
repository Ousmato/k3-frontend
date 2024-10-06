import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, filter, map } from 'rxjs';
import { IconsService } from './icons.service';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {

 

  private titleSubject = new BehaviorSubject<string>('');
  public title$ = this.titleSubject.asObservable();

  setTitle(title: string) {
    this.titleSubject.next(title);
  }
  
  constructor(private router: Router, public icons: IconsService,
    private activatedRoute: ActivatedRoute, private toastr: ToastrService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        return route?.snapshot.data['title'];
      })
    ).subscribe((title: string) => {
      this.titleSubject.next(title);
    });
  }
  // ---------------------------------------
  showSuccessToast(message: any) {
    this.toastr.success(message, `Succès`);
    
  }
  showErrorToast(erreur: any) {
    this.toastr.error(erreur, `Erreur`)
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventServiceService {

  constructor() { }

  private eventSubject = new BehaviorSubject<any>('');
  // private showModal = new BehaviorSubject<>();

  // Observable pour l'événement
  event$ = this.eventSubject.asObservable();

  // Méthode pour déclencher un événement
  emitEvent(data: any) {
    console.log(data, "data")
    this.eventSubject.next(data);
  }

  show(event:any) {
    this.eventSubject.next(event);
  }
}

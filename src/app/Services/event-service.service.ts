import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventServiceService {

  constructor() { }

  private eventSubject = new BehaviorSubject<any>('');

  // Observable pour l'événement
  event$ = this.eventSubject.asObservable();

  // Méthode pour déclencher un événement
  emitEvent(data: any) {
    console.log(data, "data")
    this.eventSubject.next(data);
  }
}
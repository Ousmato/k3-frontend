import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventServiceService {

  constructor() { }

  private eventSubject = new Subject<any>();

  // Observable pour l'événement
  event$ = this.eventSubject.asObservable();

  // Méthode pour déclencher un événement
  emitEvent(data: any) {
    this.eventSubject.next(data);
  }
}

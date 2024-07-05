import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notifications_gestion } from '../Admin/Models/Notifications-gestion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:8080/api-notification/';
  // -------------------------------add notification
  addNotifi(notification: Notifications_gestion) : Observable<Notifications_gestion>{
    return this.http.post<Notifications_gestion>(this.baseUrl + 'add', notification);
  }
  // -----------------------------get all notification
  getAll() : Observable<Notifications_gestion[]>{
    return this.http.get<Notifications_gestion[]>(this.baseUrl + 'list');
  }
}

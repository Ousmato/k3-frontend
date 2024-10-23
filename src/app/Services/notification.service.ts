import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notifications_gestion } from '../Admin/Models/Notifications-gestion';
import { Observable, catchError, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }
  private baseUrl = `${environment.apiUrl}api-notification/`;
  // const searchTerm = 'Harry Potter';
private apiUrl = `https://openlibrary.org/search?q=`;
  // -------------------------------add notification
  addNotifi(notification: Notifications_gestion) : Observable<Notifications_gestion>{
    return this.http.post<Notifications_gestion>(this.baseUrl + 'add', notification);
  }
  // -----------------------------get all notification
  getAll() : Observable<Notifications_gestion[]>{
    return this.http.get<Notifications_gestion[]>(this.baseUrl + 'list-week-notifs');
  }
  // ------------------get book library
  getBooks(nomBooks: string): Observable<any[]> {
    const url = `${this.apiUrl}${nomBooks}`;
    return this.http.get<any>(url).pipe(
      map(response => response.docs), // Assuming 'docs' contains the array of books
      catchError(error => {
        console.error('Error fetching books:', error);
        throw error; // Rethrow the error
      })
    );
}
// --------------------------------
getBooksss(query: string): Observable<any> {
  const url = `${this.apiUrl}?q=${encodeURIComponent(query)}`;
  const headers = new HttpHeaders({
    'User-Agent': 'Gestion-scolaire/1.0 (ousmatotoure98@gmail.com)'
  });

  return this.http.get<any>(url, { headers }).pipe(
    catchError(error => {
      console.error('Error fetching books:', error);
      throw error;
    })
  );
}
}
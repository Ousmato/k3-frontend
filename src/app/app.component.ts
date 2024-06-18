import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Gestion-scolaire';

  constructor(private router: Router) {}

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  isAdminPage(): boolean {
    console.log(this.router.url)
    return this.router.url.startsWith('/sidebar');
  }

  isStudentPage(): boolean {
    return this.router.url.startsWith('/student-dashboard');
  }
}
